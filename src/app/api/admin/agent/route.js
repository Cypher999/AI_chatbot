import { getAll,count } from "@/utils/db/agent"
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 0;
    const size = searchParams.get("size") || 5; 
    const filter = searchParams.get("filter") || ""; 

    const pageIndex = parseInt(page);
    const pageSize = parseInt(size);
    const totalCount = await count({
        where: {
        OR: [
            { name: { contains: filter } },
            { context: { contains: filter } },
            { description: { contains: filter } },
            {user: {
                 username: { contains: filter } 
              },
        }
        ],
        },
    });
    const data=await getAll({
        where: {
        OR: [
            { name: { contains: filter } },
            { context: { contains: filter } },
            { description: { contains: filter } },
            {user: {
                 username: { contains: filter } 
              },
        }
        ],
        },
        skip: pageIndex * pageSize,
        take: pageSize,
    });
    const totalPage=Math.ceil(totalCount/size)
    return Response.json({ data,totalCount,totalPage,page }, { status: 200 })
  } catch (error) {
    console.log(error)
    return Response.json({ error: "Encountered an error" }, { status: 500 })
  }
}