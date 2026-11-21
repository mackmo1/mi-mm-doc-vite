# Supabase queries for testing the remote save

Run these in the Supabase dashboard: **SQL Editor**. Replace `<your-user-id>` with your UUID
(Authentication → Users → UID, or `select id from auth.users where email = '...'`).

Notes:
- The column is `updated_at`, not `updatedAt`.
- The SQL editor runs with admin rights and bypasses row-level security, so filter by `user_id`.
- `content` is the full HTML and can be long. Use `length(content) as content_len` or
  `left(content, 120) as preview` for a quick scan.

## Latest notes in `branches1`

```sql
select id, title, updated_at, content
from branches1
where user_id = '<your-user-id>'
order by updated_at desc
limit 5;
```

For only the note you edited last, change `limit 5` to `limit 1`.

## Latest notes across all five levels

```sql
select 1 as level, id, title, updated_at, content from branches1 where user_id = '<your-user-id>'
union all
select 2, id, title, updated_at, content from branches2 where user_id = '<your-user-id>'
union all
select 3, id, title, updated_at, content from branches3 where user_id = '<your-user-id>'
union all
select 4, id, title, updated_at, content from branches4 where user_id = '<your-user-id>'
union all
select 5, id, title, updated_at, content from branches5 where user_id = '<your-user-id>'
order by updated_at desc
limit 5;
```

## How to use them when testing

1. Run a query and note the `updated_at` and `content` of the branch you are about to edit.
2. Edit the branch in the app and stop typing for 3 seconds (or close the editor).
3. Run the query again. `updated_at` should have moved forward and `content` should match the editor.
