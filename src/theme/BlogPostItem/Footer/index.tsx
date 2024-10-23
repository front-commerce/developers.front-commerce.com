import { useColorMode } from "@docusaurus/theme-common";
import { useBlogPost } from "@docusaurus/plugin-content-blog/client";
import Giscus from "@giscus/react";
import ReadMoreLink from "@theme/BlogPostItem/Footer/ReadMoreLink";
import EditThisPage from "@theme/EditThisPage";
import TagsListInline from "@theme/TagsListInline";
import clsx from "clsx";
import React from "react";
import styles from "./styles.module.css";

export default function BlogPostItemFooter() {
  const { colorMode } = useColorMode();
  const { metadata, isBlogPostPage } = useBlogPost();
  const { tags, title, editUrl, hasTruncateMarker } = metadata;
  // A post is truncated if it's in the "list view" and it has a truncate marker
  const truncatedPost = !isBlogPostPage && hasTruncateMarker;
  const tagsExists = tags.length > 0;
  const renderFooter = tagsExists || truncatedPost || editUrl;
  if (!renderFooter) {
    return null;
  }
  return (
    <footer
      className={clsx(
        "row docusaurus-mt-lg",
        isBlogPostPage && styles.blogPostFooterDetailsFull
      )}
    >
      {isBlogPostPage && (
        <Giscus
          id="comments"
          repo="front-commerce/developers.front-commerce.com"
          repoId="MDEwOlJlcG9zaXRvcnkxMjUwNDY0NjE="
          category="Comments"
          categoryId="DIC_kwDOB3QOvc4CUxxg"
          mapping="title"
          term="Comments"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={colorMode}
          lang="en"
          loading="lazy"
        />
      )}

      {tagsExists && (
        <div className={clsx("col", { "col--9": truncatedPost })}>
          <TagsListInline tags={tags} />
        </div>
      )}

      {isBlogPostPage && editUrl && (
        <div className="col margin-top--sm">
          <EditThisPage editUrl={editUrl} />
        </div>
      )}

      {truncatedPost && (
        <div
          className={clsx("col text--right", {
            "col--3": tagsExists,
          })}
        >
          <ReadMoreLink blogPostTitle={title} to={metadata.permalink} />
        </div>
      )}
    </footer>
  );
}
