import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './routes/Routes/Routes';
import VantaBackground from './Hooks/VantaBackground';
function App() {
  return (
    <div>
      <VantaBackground />
      <RouterProvider router={router}></RouterProvider>
      <Toaster></Toaster>
    </div>
  );
}

export default App;
