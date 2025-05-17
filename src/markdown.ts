import markdownit from "markdown-it";

export const md = markdownit();

// target="_blank" for all links

const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet("target", "_blank");
  return defaultRender(tokens, idx, options, env, self);
};
