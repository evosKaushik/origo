
import {
  SyntaxKind,
  type SourceFile,
  type CallExpression,
} from "ts-morph";

export function findCallExpression(
  source: SourceFile,
  functionName: string
): CallExpression | undefined {
  return source
    .getDescendantsOfKind(
      SyntaxKind.CallExpression
    )
    .find(call =>
      call.getExpression().getText() === functionName
    );
}
