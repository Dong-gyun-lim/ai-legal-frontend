import React from "react";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={"rounded-xl border bg-white " + (props.className ?? "")} />
  );
}
export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={"p-6 border-b " + (props.className ?? "")} />;
}
export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={"p-6 " + (props.className ?? "")} />;
}
export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={"text-lg font-semibold " + (props.className ?? "")} />;
}
export function CardDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={"text-sm text-slate-500 " + (props.className ?? "")} />;
}
