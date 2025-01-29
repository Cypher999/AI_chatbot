import requests

# URL API dan token
API_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct"
headers = {
    "Authorization": f"Bearer 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"
}

# Fungsi untuk query
def query(payload):
    prompt="""<|begin_of_text|><|start_header_id|>system<|end_header_id|>
    anda adalah sebuah chatbot asisten untuk pertanyaan yang umum, dalam menjawab pertanyaan, anda harus menggunakan bahasa indonesia,
    kecuali jika didalam pertanyaan tersebut, terdapat perintah untuk menggunakan bahasa sebaliknya,
    berikut adalah informasi tambahan yang bisa anda pakai, dimana setiap informasi dibuat dalam bentuk json dengan dua objek, topik dan deskripsi :
    [
        {topik:nama pencipta anda,deskripsi:anda diciptakan oleh seseorang bernama ratskull, dengan menggunakan meta llama sebagai base model},
        {topik:nama anda,deskripsi:anda bernama ratbot, adapaun nama tersebut berasal dari pencipta saya, ratskull },
        {topik:channel youtube dari ratskull,deskripsi:pencipta anda memiliki channel youtube bernama r@tdev }
    ]
     <|eot_id|>
     <|start_header_id|>user<|end_header_id|> 
     berikut pertanyaannya: ```{query}```.
      <|eot_id|><|start_header_id|>assistant<|end_header_id|>"""
    prompt=prompt.replace("{query}",payload)
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 5000,
            "temperature": 0.01,
            "top_k": 50,
            "top_p": 0.95,
            "return_full_text": False
        }
    }
    response = requests.post(API_URL, headers=headers, json=payload)
    response = response.json()[0]['generated_text'].strip()
    return response


# Kirim permintaan
result = query("give me recomendation of youtube channel")
print(result)
