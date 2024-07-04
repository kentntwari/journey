import { Form } from "~/routes/ressource.form.checkpoint/Form";

import * as Skeletons from "../Skeletons";
import { Body } from "../Checkpoint/Body";
import { Header } from "../Checkpoint/Header";
import { Snippet } from "../Checkpoint/Snippet";

export const Checkpoint = {
  Snippet,
  Form,
  DetailsHeader: Header,
  DetailsBody: Body,
  Skeleton: {
    Header: Skeletons.FetchingHeaderSkeleton,
    Body: Skeletons.FetchingBodySkeleton,
  },
} as const;
