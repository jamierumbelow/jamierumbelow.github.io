let mix = require("laravel-mix");

require("laravel-mix-tailwind");

mix.css("css/style.css", "public").tailwind();
