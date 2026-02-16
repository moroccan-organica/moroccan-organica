-- Admin user (password: admin123)
INSERT INTO "User" ("id", "name", "email", "password", "role")
VALUES (
    'user_admin_01', 
    'Admin User', 
    'admin@moroccan-organica.com', 
    '$2a$12$R9h/cIPz0gi.URQHeNV5UedCPxKqbGZOKs9n5B6bNhXfKv.zP.WxC', 
    'ADMIN'
) ON CONFLICT ("email") DO NOTHING;
