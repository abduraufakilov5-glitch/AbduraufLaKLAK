import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema=z.object({status:z.enum(["pending","confirmed","processing","shipped","delivered","cancelled","returned"])});
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();if(!profile||!["ADMIN","WAREHOUSE_MANAGER"].includes(String(profile.role)))return NextResponse.json({error:"Forbidden"},{status:403});
 const {id}=await params; if(!z.string().uuid().safeParse(id).success)return NextResponse.json({error:"Invalid order id"},{status:400});
 const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Invalid status"},{status:400});
 const {data:before}=await supabase.from("orders").select("status,total").eq("id",id).single();
 if(!before)return NextResponse.json({error:"Order not found"},{status:404});
 const {data:order,error}=await supabase.from("orders").update({status:parsed.data.status,updated_at:new Date().toISOString()}).eq("id",id).select("id,status,total,updated_at").single();
 if(error)return NextResponse.json({error:error.message},{status:400});
 await supabase.from("notifications").insert({type:"ORDER_STATUS",title:"Order status updated",message:`Order ${id.slice(0,8)} → ${parsed.data.status}`,metadata:{order_id:id,status:parsed.data.status}});
 await supabase.from("audit_logs").insert({actor_id:user.id,action:"order.status_changed",entity_type:"orders",entity_id:id,before_data:before,after_data:order});
 return NextResponse.json(order);
}
