export const template = ({
  title,
  nav,
  content,
  cssHash,
  lastUpdated,
}: {
  title: string;
  nav: string;
  content: string;
  cssHash: string;
  lastUpdated?: Date;
}) => `<!DOCTYPE html>
<html>
  <head>
    <title>${title} &middot; jamie rumbelow</title>
    <link href="./style.css${cssHash}" rel="stylesheet" />
  </head>
  <body class="text-sm">
    <div
      class="container flex flex-col mx-auto mt-8  md:items-start md:flex-row-reverse md:mt-16"
    >
      <header
        class="flex flex-row-reverse justify-center w-full text-right  md:flex-col md:items-end md:w-1/2 lg:w-1/6"
      >
        <span class="w-2/5 md:w-2/3">
          <img src="images/me.png" alt="me" />
        </span>
        <span class="mt-8">
          <h1 class="font-semibold">Jamie Rumbelow</h1>
          <ul>
            ${nav}
          </ul>
        </span>
      </header>
      <div
        class="w-full p-8 mt-2 mr-auto leading-relaxed  md:p-0 md:mt-0 md:w-1/2 lg:w-1/3"
      >
        ${content}

        ${
          lastUpdated
            ? `<footer class="w-full mt-20 text-xs">Last updated: ${lastUpdated.toDateString()}</footer>`
            : ""
        }
      </div>
    </div>
  </body>
</html>
`;
