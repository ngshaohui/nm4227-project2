# NM4227 AY19/20 S2

## Dependencies

1. A working browser
2. Python 3

## How to Run

1. Start python 3 server
   > `python3 -m http.server 8080`
2. (alternative) Start python 2 server (python 2 is included by default on macOS)
   > `python -m SimpleHTTPServer 8080`
3. Navigate to `localhost:8080` on your browser

Do note that newer installations of python3 are just called python. In this case change the start server command as necessary.
Do note that you should also be able to host it with any other server such as express or apache

## How to Cheat (Alex)

1. To display all the platforms, toggle the `DEBUG` variable exported in `env.js`
   > `const DEBUG = true`

Remember to refresh the page after changing any file.
If your changes do not seem to work, your browser may be caching the files. In this case you can open the network inspector for your browser and disable cache.

## Details

- Built with Phaser 3.22
- Built for NM4227 AY1920 S2 under Alex Mitchell
- Hosted on [https://www.comp.nus.edu.sg/~shaohui/nm4227/](https://www.comp.nus.edu.sg/~shaohui/nm4227/)
- Alex version hosted on [https://www.comp.nus.edu.sg/~shaohui/nm4227debug/](https://www.comp.nus.edu.sg/~shaohui/nm4227debug/)
