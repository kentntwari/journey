import { Form } from "~/routes/ressource.form.checkpoint/Form";

import * as Skeletons from "../Skeletons";
import { Body } from "./Body";
import { Header } from "./Header";
import { Snippet } from "./Snippet";

export const Checkpoint = {
  Snippet,
  Form,
  DetailsHeader: Header,
  DetailsBody: Body,
  Skeleton: {
    Header: Skeletons.FetchingCheckpointHeaderSkeleton,
    Body: Skeletons.FetchingCheckpointBodySkeleton,
  },
} as const;
