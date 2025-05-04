import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface CommentBoxProps {
  postId: number | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CommentBox({ postId }: CommentBoxProps) {
  
  return (
    <form className="space-y-4">
      <Textarea
        id="content"
        name="content"
        placeholder="Add a comment..."
        disabled={false}
        required
        className="min-h-[100px]"
      />

      <Button type="submit" disabled={false}>
        Post Comment
      </Button>
    </form>
  );
}
