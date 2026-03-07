import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Spinner } from "./ui/spinner";

export function LoadingSpinner({
  title = "Loading...",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Spinner className="size-8" />
        </EmptyMedia>
        {title && <EmptyTitle>{title}</EmptyTitle>}
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  );
}
