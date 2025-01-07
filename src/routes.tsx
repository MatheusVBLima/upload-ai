import { Routes, Route } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { Home } from "./pages/Home";
import { VideoSubtitle } from "./pages/VideoSubtitle";
import { useContext } from "react";
import { Context } from "./context/Context";
import { VideoTitleDescription } from "./pages/VideoTitleDescription";
import { TextSpeech } from "./pages/TextSpeech";

export function Router() {
  const { setVideoId } = useContext(Context);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route
          path="/subtitle"
          element={<VideoSubtitle onVideoUploaded={setVideoId} />}
        />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route path="/titledescription" element={<VideoTitleDescription />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route path="/textspeech" element={<TextSpeech />} />
      </Route>
    </Routes>
  );
}
