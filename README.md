d3-task-scheduler
=================

`d3-task-scheduler` is a chart that shows tasks as draggable dots. It accepts as input a schedule as it's modeled by the [tasks-scheduler](https://github.com/Collaborne/tasks-scheduler). The web component is built with [Polymer 2.x](https://www.polymer-project.org) and [D3 v.4](http://d3js.org).

To use this element:

`bower install d3-task-scheduler`

```html
<d3-task-scheduler
    width="600"
    height="300"
    start="2018-04-10"
    deadlines='{"http://collaborne.com/schema/1.0/tasks/sensing": "2018-04-25","http://collaborne.com/schema/1.0/tasks/visioning": "2018-05-05","http://collaborne.com/schema/1.0/tasks/prototyping": "2018-05-20","http://collaborne.com/schema/1.0/tasks/scaling": "2018-06-01"}'>
</d3-task-scheduler>
```

## License

    This software is licensed under the Apache 2 license, quoted below.

    Copyright 2011-2015 Collaborne B.V. <http://github.com/Collaborne/>

    Licensed under the Apache License, Version 2.0 (the "License"); you may not
    use this file except in compliance with the License. You may obtain a copy of
    the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
    License for the specific language governing permissions and limitations under
    the License.
    
