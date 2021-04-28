import App from "./App";
import services from "./services";

const app = new App(services());

app.serve().start();

export default app;
