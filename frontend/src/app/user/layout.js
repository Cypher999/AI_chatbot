import Layout from "@/Components/User/Layout/Layout";
export const metadata = {
    title: "admin panel",
    description: "admin panel for simple chatbot",
  };
export default function ({children}){
    return (
        <Layout>
            {children}
        </Layout>
    )
}

