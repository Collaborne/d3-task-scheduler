d3-task-scheduler
[![Build Status](https://travis-ci.org/Collaborne/d3-task-scheduler.svg?branch=master)](https://travis-ci.org/Collaborne/d3-task-scheduler)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/collaborne/d3-task-scheduler)  
[![Published on Vaadin  Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/Collaborned3-task-scheduler)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/Collaborned3-task-scheduler.svg)](https://vaadin.com/directory/component/Collaborned3-task-scheduler)
=================

`d3-task-scheduler` is a chart that shows tasks as draggable dots. It accepts as input a schedule as it's modeled by the [tasks-scheduler](https://github.com/Collaborne/tasks-scheduler). The web component is built with [Polymer 2.x](https://www.polymer-project.org) and [D3 v.4](http://d3js.org).

To use this element:

`npm install collaborne-d3-task-scheduler --save`

```html
<script src="d3/dist/d3.min.js"></script>
<d3-task-scheduler
    height="300"
    start="2018-04-10"
    deadlines="[{taskId: 'planning',name: 'Planning',date: '2018-04-25'},{taskId: 'concepting',name: 'Concepting',date: '2018-05-05'},{taskId: 'implementation',name: 'Implementation',date: '2018-05-20'}]">
</d3-task-scheduler>
```

## Start the demo
Clone the repo:
```
git clone https://github.com/Collaborne/d3-task-scheduler
```

Then, run:
```
bower install
```
and to start the demo:
```
npm install -g polymer-cli && polymer serve
```

## License

    This software is licensed under the Apache 2 license, quoted below.

    Copyright 2011-2018 Collaborne B.V. <http://github.com/Collaborne/>

    Licensed under the Apache License, Version 2.0 (the "License"); you may not
    use this file except in compliance with the License. You may obtain a copy of
    the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
    License for the specific language governing permissions and limitations under
    the License.

