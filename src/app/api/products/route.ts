import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const variantSchema=z.object({sku:z.string().trim().min(1).max(80),color:z.string().trim().max(80).optional(),material:z.string().trim().max(80).optional(),size:z.string().trim().max(80).optional(),cost_price:z.number().nonnegative(),selling_price:z.number().nonnegative(),quantity:z.number().int().nonnegative().default(0),minimum_quantity:z.number().int().nonnegative().default(0)});
const createSchema=z.object({name:z.string().trim().min(1).max(160),slug:z.string().trim().min(1).max(180).regex(/^[a-z0-9-]+$/),category_id:z.string().uuid().nullable().optional(),description:z.string().max(5000).optional(),variant:variantSchema});

export async function POST(request:Request){
 const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();if(!profile||!["ADMIN","CONTENT_MANAGER","WAREHOUSE_MANAGER"].includes(String(profile.role)))return NextResponse.json({error:"Forbidden"},{status:403});
 const parsed=createSchema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Invalid product payload"},{status:400});
 const {name,slug,category_id,description,variant}=parsed.data;
 const {data:product,error}=await supabase.from("products").insert({name,slug,category_id:category_id??null,description:description??null}).select("id,name,slug").single();
 if(error||!product)return NextResponse.json({error:error?.message??"Could not create product"},{status:400});
 const {data:createdVariant,error:variantError}=await supabase.from("product_variants").insert({product_id:product.id,sku:variant.sku,color:variant.color??null,material:variant.material??null,size:variant.size??null,cost_price:variant.cost_price,selling_price:variant.selling_price,quantity:0,minimum_quantity:variant.minimum_quantity}).select("id,sku,quantity").single();
 if(variantError||!createdVariant){await supabase.from("products").delete().eq("id",product.id);return NextResponse.json({error:variantError?.message??"Could not create SKU"},{status:400});}
 if(variant.quantity>0){const {error:movementError}=await supabase.rpc("apply_inventory_movement",{p_variant_id:createdVariant.id,p_type:"stock_in",p_quantity:variant.quantity,p_note:"Initial stock"});if(movementError){await supabase.from("product_variants").delete().eq("id",createdVariant.id);await supabase.from("products").delete().eq("id",product.id);return NextResponse.json({error:movementError.message},{status:500});}}
 await supabase.from("audit_logs").insert({actor_id:user.id,action:"product.created",entity_type:"products",entity_id:product.id,after_data:{...product,sku:createdVariant.sku}});
 return NextResponse.json({...product,variant:{...createdVariant,quantity:variant.quantity}},{status:201});
}
