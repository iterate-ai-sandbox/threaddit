import mixpanel from "mixpanel-browser";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthConsumer from "../../components/AuthContext";
import InfinitePostsLayout from "../../components/InfinitePosts";
export function Feed() {
  const { isAuthenticated } = AuthConsumer();
  const navigate = useNavigate();
  const { feedName } = useParams();
  if (feedName == "home" && !isAuthenticated) {
    return navigate("/login");
  }
  useEffect(() => {
    document.title = `Threaddit | ${feedName}`;
    const mp = mixpanel;
    mp.track("Feed Page Visit", { feedName, });
    mixpanel.track('test', { 'test': 'test' });
  }, [feedName]);
  return (
    <InfinitePostsLayout
      linkUrl={`posts/${feedName || "all"}`}
      apiQueryKey={feedName}
    />
  );
}

export default Feed;
