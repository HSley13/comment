import { Row, Col, Container } from "react-bootstrap";
import { CommentCard } from "./CommentCard";
import { dateFormatter } from "./Comment";
import { Post } from "../types/types";
import { useAllPostsContext } from "../contexts/AllPostsContext";
import { createPost } from "../services/posts";
import { PostForm } from "./PostForm";
import { useAsyncFn } from "../hooks/useAsync";

export const PostList = () => {
  const { loading, error, posts, createLocalPost } = useAllPostsContext();
  const createPostFunc = useAsyncFn(createPost);

  const onPostSubmit = async (title: string, body: string, userId: string) => {
    const post = await createPostFunc.execute({
      userId: userId,
      title: title,
      body: body,
    });
    createLocalPost(post);
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <h1>Loading...</h1>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-5">
        <h1 className="error-msg">{error?.message}</h1>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Col className="mb-4">
        <h1 className="text-center mb-4">Create Post</h1>
        <PostForm
          onSubmit={onPostSubmit}
          loading={createPostFunc.loading}
          error={createPostFunc.error}
        />
      </Col>
      <h1 className="text-center mb-4">Most Recent Posts</h1>
      <Row xs={1} md={2} xl={3} className="g-3">
        {posts?.map((post: Post) => (
          <Col key={post.id}>
            <CommentCard
              id={post.id.toString()}
              title={post.title}
              updatedAt={dateFormatter.format(
                Date.parse(post.updated_at || post.updatedAt),
              )}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
