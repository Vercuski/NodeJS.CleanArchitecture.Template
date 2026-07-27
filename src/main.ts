import { buildApp } from "./bootstrap/composition-root.ts";

const port = Number(process.env.PORT ?? 3000);
const app = buildApp();

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
