import { useSinglePostContext } from "../contexts/SinglePostContext";
import { IconButton } from "./IconButton";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CommentList } from "./CommentList";
import { CommentForm } from "./CommentForm";
import { useAsyncFn } from "../hooks/useAsync";
import { createComment } from "../services/comments";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { PostForm } from "./PostForm";
import { useAllPostsContext } from "../contexts/AllPostsContext";
import { useState } from "react";
import { updatePost, deletePost } from "../services/posts";

export const Post = () => {
  const { createLocalComment, post, rootComments } = useSinglePostContext();
  const { updateLocalPost, deleteLocalPost } = useAllPostsContext();
  const [isEditing, setIsEditing] = useState(false);
  const currentUser = useUser();
  const navigate = useNavigate();

  const createCommentFunc = useAsyncFn(createComment);

  const updatePostFn = useAsyncFn(updatePost);
  const deletePostFn = useAsyncFn(deletePost);

  const onPostSubmit = async (title: string, body: string) => {
    const updatedPost = await updatePostFn.execute({
      id: post?.id.toString() || "",
      title: title,
      body: body,
    });
    updateLocalPost(
      updatedPost.id,
      updatedPost.title,
      updatedPost.body,
      updatedPost.updatedAt,
    );
    setIsEditing(false);
  };

  const onDeletePost = async () => {
    await deletePostFn.execute({
      id: post?.id.toString() || "",
    });
    deleteLocalPost(post?.id || "");
    navigate("/");
  };

  const onCommentSubmit = async (message: string) => {
    const newComment = await createCommentFunc.execute({
      postId: post?.id || "",
      message,
    });
    createLocalComment(newComment);
  };

  return (
    <Container className="my-2">
      {post?.userId === currentUser?.id ? (
        isEditing ? (
          <Row>
            <Col xs={12}>
              <PostForm
                title={post?.title}
                body={post?.body}
                imgUrl={post?.imageUrl}
                onSubmit={onPostSubmit}
                loading={updatePostFn.loading}
                error={updatePostFn.error}
              />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs={12} className="d-flex justify-content-between">
              <h1>{post?.title}</h1>
              <Col xs="auto">
                <IconButton
                  Icon={FaEdit}
                  color="blue"
                  onClick={() => setIsEditing(true)}
                />
                {!isEditing && (
                  <IconButton
                    Icon={FaTrash}
                    color="red"
                    onClick={onDeletePost}
                  />
                )}
              </Col>
            </Col>

            <Col xs={12}>
              <p>{post?.body}</p>
            </Col>
          </Row>
        )
      ) : (
        <>
          <h1>{post?.title}</h1>
          <p>{post?.body}</p>
        </>
      )}

      <h3>Comments</h3>

      <section>
        <CommentForm
          onSubmit={onCommentSubmit}
          loading={createCommentFunc.loading}
          error={createCommentFunc.error}
          autoFocus={true}
        />
        {rootComments && rootComments.length > 0 && (
          <div className="mt-4">
            <CommentList comments={rootComments} />
          </div>
        )}
      </section>
    </Container>
  );
};
