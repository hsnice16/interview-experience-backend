export type Organisation = {
  _id: string;
  name: string;
  blogscount: number;
};

export type Author = {
  _id: string;
  name: string;
  profile: string;
};

export type Blog = {
  _id: string;
  title: string;
  link: string;
  organisation: string;
  author: string;
};

export type StagingBlog = {
  _id: string;
  title: string;
  link: string;
  organisation_name: string;
  author_name: string;
  author_profile: string;
  status: string;
};
