import React, { memo, useId } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Oak } from "./OakScene";
import type { TreeConfig } from "./model";
export { Oak };
export const Thumbnail = memo(function Thumbnail({
  tree,
}: {
  tree: TreeConfig;
}) {
  const prefix = useId();
  const svg = renderToStaticMarkup(<Oak tree={tree} small prefix={prefix} />);
  return (
    <img
      alt=""
      src={"data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg)}
    />
  );
});
export function exportSvg(tree: TreeConfig, time: number) {
  return renderToStaticMarkup(<Oak tree={tree} time={time} />);
}
