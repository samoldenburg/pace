# Pace Calculator
A pretty basic running pace calculator because I didn't like the ones that were currently out there on the web.

Built using cool stuff like React, Webpack, ES2015, etc.

### Working Demo
http://www.calculatemypace.net/

### Note
This calculator was put together in just a couple hours, and is absolutely not efficient in its usage of libraries. The output for this small calculator is nearly 500kb of uglified JS. The simple truth is this was built as a learning tool for me and is one of the first times I've made something practical using React. In practice, this functionality could be replicated in vanilla JS probably in under 3 kb.

### Installation
You'll need to drop the source in a vhost environment, or setup Vagrant yourself. I personally install it in a simple vhost on an XAMPP server. You will need to configure the browsersync proxy in `gulpfile.js`
`$ npm install`
`$ gulp`
