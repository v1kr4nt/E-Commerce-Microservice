import jwt from "jsonwebtoken";

export async function isAuthenticated(req: any, res: any, next: any) {
  //header-> "Bearer <token>".split(" ")[1]
  const token = req.headers["authorization"].split(" ")[1];
  jwt.verify(token, "secret", (err: any, user: any) => {
    if (err) {
      return res.json({ message: err });
    } else {
      req.user = user;
      next();
    }
  });
}
