import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import DataGrid from "./components/DataGrid/";

function App() {
  return (
    <>
      <DataGrid />
      <Analytics />
    </>
  );
}

export default App;
