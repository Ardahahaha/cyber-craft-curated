INSERT INTO public.user_roles (user_id, role)
VALUES ('d97c952a-bec4-44a9-a32c-5f7e1e3f16f3', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;