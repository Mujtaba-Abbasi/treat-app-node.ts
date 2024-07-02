export const user_view = `
CREATE VIEW user_view AS
SELECT 
  id AS "id",
  first_name AS "firstName",
  last_name AS "lastName",
  username AS "username",
  email AS "email",
  role AS "role",
  is_active AS "isActive",
  created_at AS "createdAt"
FROM 
  "user";
`;
