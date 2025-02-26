export type IPermission = 
    {
    "id":string,
    "created_at":string,
    "role":"user" | "admin",
    "status":"active" | "resigned",
    "member_id":string,
    "members":{
        "id":string,
        "name":string,
        "created_at":string,
        "email":string
    }}

export type IBook = 
    {
    "id":string,
    "created_at":string,
    "title": string
    "description": string,
    "status":"available" | "unavailable",
    "member_id?":string,
    "members?":{
        "id":string,
        "name":string,
        "created_at":string,
        "email":string
    }}
