import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
A chart that shows tasks as draggable dots

### Styling

The following custom properties are available for styling:

Custom property                       | Description                                              | Default
--------------------------------------|----------------------------------------------------------|----------
`--task-scheduler-background-color`   | Color of the background                                  | `#e0e0e0`
`--task-scheduler-area-color`         | Color of the background of the graph under the valueline | `#f6faf6`
`--task-scheduler-footer-color`       | Color of the background of footer                        | `#bfbfbf`
`--task-scheduler-today-marker-color` | Color of the marker indicating today                     | `#E30B5C`
`--task-scheduler-dots-color`         | Color of the dots and the line connecting them           | `#71af26`
`--task-scheduler-axis-color`         | Color of the axis, including axis line, ticks and labels | `#666666`
`--task-scheduler-font-family`        | Font family for the text parts                           | `sans-serif`
`--task-scheduler-label-size`         | Font size for graph labels                               | `8px`

### Example

```html
<d3-task-scheduler
	height="300"
	deadlines="[[deadlines]]">
</d3-task-scheduler>
```

@demo demo/index.html
*/
class D3TaskScheduler extends PolymerElement {
	static get template() {
		return html`
		<style>
			:host {
				display: inline-block;
				background-color: var(--task-scheduler-background-color, #e0e0e0);
				font-family: var(--task-scheduler-font-family, "sans-serif");
			}

			.svg-container { 
				display: inline-block;
				position: relative;
				width: 100%;
				padding-bottom: 50%; /* Aspect ratio */
				vertical-align: middle; 
				overflow: hidden; 
			}

			.svg-content { 
				display: inline-block;
				position: absolute;
				top: 0;
				left: 0;
			}

			path {
				stroke-width: 2;
				fill: none;
			}
			.axis {
				font-family: var(--task-scheduler-font-family, "sans-serif");
			}
			.axis path,
			.axis line {
				fill: none;
				stroke: var(--task-scheduler-axis-color, #666666);
				stroke-width: 1;
				shape-rendering: crispEdges;
			}
			.axis text {
				fill: var(--task-scheduler-axis-color, #666666);
				font-size: var(--task-scheduler-axis-size, 20px);
			}
			.tooltip {
				text-align: center;
				fill: var(--task-scheduler-axis-color, #666666);
				font-size: var(--task-scheduler-label-size, 20px);
			}
			#todayLine {
				stroke-width: 1;
				stroke: var(--task-scheduler-today-line-color, #808080);
			}
			#valueLine {
				fill: none;
				stroke: var(--task-scheduler-dots-color, #71af26);
			}
			circle {
				fill: var(--task-scheduler-dots-color, #71af26);
			}
			.draggable {
				stroke: #fff;
				stroke-width: 2;
				cursor: -webkit-grab;
			}
			#area {
				fill: var(--task-scheduler-area-color, #f6faf6);
			}
			.label {
				fill: var(--task-scheduler-axis-color, #666666);
				font-size: var(--task-scheduler-label-size, 20px);
				font-weight: bold;
			}
			#footer {
				fill: var(--task-scheduler-footer-color, #bfbfbf);
			}
		</style>

		<div class="svg-container">
			<svg id="svg" viewBox="0 0 1000 500" preserveAspectRatio="xMinYMin meet" class="svg-content">
				<rect id="footer" x="0" width="100%"></rect>
				<g transform\$="[[_transform]]">
					<path id="area"></path>
					<path id="valueLine"></path>
					<g id="xAxis"></g>
					<g id="yAxis"></g>

					<line id="todayLine"></line>
					<image id="todayPin" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNG1tIiBoZWlnaHQ9IjI0bW0iIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGc+PHBhdGggZmlsbD0iI2Q4MWI2MCIgZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIvPjwvZz48L3N2Zz4=" height="30" width="30"></image>
				</g>
			</svg>
		</div>`;
	}

	static get is() {
		return 'd3-task-scheduler';
	}

	static get properties() {
		return {

			_formatDate: {
				type: Function,
				value: () => window.d3.timeFormat('%Y-%m-%d'),
			},

			_graphHeight: {
				computed: '_computeGraphHeight(height, margin)',
				type: Number,
			},

			_graphWidth: {
				computed: '_computeGraphWidth(width, margin)',
				type: Number,
			},

			_parseDate: {
				type: Function,
				value: () => window.d3.timeParse('%Y-%m-%d'),

			},

			_tasks: {
				computed: '_computeTasks(deadlines)',
				type: Array,
			},

			_todayDateStr: String,

			_tooltipFormat: {
				type: Function,
				value: () => window.d3.timeFormat('%d %B %Y'),
			},

			_transform: {
				computed: '_computeTransform(margin)',
				type: String,
			},

			/**
			* Array of tasks
			*/
			deadlines: {
				notify: true,
				type: Array,
			},

			/**
			* Component height
			*/
			height: {
				type: Number,
				value: 500,
			},

			margin: {
				type: Object,
				value: {
					bottom: 50,
					left: 50,
					right: 50,
					top: 30,
				},
			},

			/**
			* Component width
			*/
			width: {
				type: Number,
				value: 1000,
			},

			// Functions to calculate ranges
			x: {
				computed: '_computeXRange(width, _graphWidth, _tasks)',
				type: Number,
			},

			y: {
				computed: '_computeYRange(height, margin)',
				type: Number,
			},
		};
	}

	static get observers() {
		return [
			'_drawXAxis(x, _graphHeight)',
			'_drawYAxis(y)',
			'_positionFooter(_graphHeight, margin)',
			'_positionTodayMarker(x, _graphHeight, _todayDateStr)',
			'_drawDots(x, y, _tasks, _todayDateStr)',
			'_drawLabels(x, y, _tasks)',
			'_drawValueLine(x, y, _tasks)',
			'_drawColoredArea(x, y, _tasks, _graphHeight)',
		];
	}

	ready() {
		super.ready();

		this._todayDateStr = this._formatDate(new Date());
	}

	_computeTransform(margin) {
		return `translate(${margin.left}, ${margin.top})`;
	}

	_computeGraphWidth(width, margin) {
		return width - margin.left - margin.right;
	}

	_computeGraphHeight(height, margin) {
		return height - margin.top - margin.bottom;
	}

	_computeXRange(width, graphWidth, tasks) {
		if (!width || !graphWidth || !tasks) {
			return undefined;
		}

		const firstDate = new Date(tasks[0].date);
		const lastDate = new Date(tasks[tasks.length - 1].date);
		const projectDuration = lastDate.getTime() - firstDate.getTime();
		const projectDurationInDays = projectDuration / 1000 / 60 / 60 / 24;

		const border = projectDurationInDays / 5;
		const minDate = firstDate.setDate(firstDate.getDate() - border);
		const maxDate = lastDate.setDate(lastDate.getDate() + border);

		return window.d3.scaleTime()
			.domain([minDate, maxDate])
			.range([0, graphWidth]);
	}

	_computeYRange(height, margin) {
		if (!height || !margin) {
			return undefined;
		}

		return window.d3.scaleLinear()
			.domain([0, 100])
			.range([height - margin.top - margin.bottom, 0]);
	}

	_drawXAxis(x, graphHeight) {
		if (!x || !graphHeight) {
			return;
		}

		const xAxis = window.d3.axisBottom(x).ticks(window.d3.timeMonth).tickFormat(window.d3.timeFormat('%B'));
		window.d3.select(this.$.xAxis)
			.attr('class', 'x axis')
			// By default x axis is on the upperside
			// so we need to move it down by the graph height
			.attr('transform', `translate(0,${graphHeight})`)
			.call(xAxis);
	}

	_drawYAxis(y) {
		const yAxis = window.d3.axisLeft(y).tickFormat('').tickSizeInner([-16]);
		window.d3.select(this.$.yAxis)
			.attr('class', 'y axis')
			.call(yAxis);
	}

	_computeTasks(deadlines) {
		return deadlines.map(deadline => {
			return {
				date: this._parseDate(deadline.date),
				dateStr: deadline.date,
				name: deadline.name,
				percentage: 100 * deadline.progress,
				progress: deadline.progress,
				taskId: deadline.taskId,
			};
		});
	}

	addTooltip(task) {
		window.d3.select(this.$.svg).select('g').append('text')
			.attr('class', 'tooltip')
			.text(this._tooltipFormat(task.date))
			.attr('x', this.x(task.date) - 16)
			// Position tooltip above the dot so that it's readable
			.attr('y', this.y(task.percentage) + 48);
	}

	removeTooltip() {
		window.d3.select(this.$.svg).select('.tooltip').remove();
	}

	_updateTooltip(task) {
		window.d3.select(this.$.svg).select('.tooltip')
			.text(this._tooltipFormat(task.date))
			.attr('x', this.x(task.date));
	}

	// Draws dots for each task
	_drawDots(x, y, tasks, todayDateStr) {
		if (!x || !y || !tasks || !todayDateStr) {
			return;
		}

		// Define class of the circle as the phase name
		// plus 'draggable' to apply different styles
		const computeDotClass = task => {
			const isDraggable = task.dateStr >= todayDateStr;
			return `${task.taskId}${isDraggable ? ' draggable' : ''}`;
		};

		const dots = window.d3.select(this.$.svg).select('g').selectAll('circle')
			.data(tasks)
			.attr('class', computeDotClass)
			.attr('cx', task => x(task.date))
			.attr('cy', task => y(task.percentage));

		const drag = window.d3.drag()
			.on('drag', this._onDotDragged.bind(this))
			.on('end', this._onDotDragEnd.bind(this));

		dots.enter().append('circle')
			.attr('class', computeDotClass)
			.attr('r', 8)
			.attr('cx', task => x(task.date))
			.attr('cy', task => y(task.percentage))
			.on('mouseover', task => this.addTooltip(task))
			.on('mouseout', () => this.removeTooltip())
			.call(drag);

		dots.exit().remove();
	}

	// Handles if a dot is dragged
	_onDotDragged(task) {
		const futureDate = this.x.invert(window.d3.event.x);
		if (this._canDrag(task, futureDate)) {
			// Update the date for the dragged task
			task.date = futureDate;

			this._drawDots(this.x, this.y, this._tasks, this._todayDateStr);
			this._drawValueLine(this.x, this.y, this._tasks);
			this._drawLabels(this.x, this.y, this._tasks);
			this._drawColoredArea(this.x, this.y, this._tasks, this._graphHeight);
			this._updateTooltip(task);
		}
	}

	// Handles if a dot is dragged to final point
	_onDotDragEnd(task) {
		this.deadlines = this.deadlines.map(deadline => {
			if (deadline.taskId === task.taskId) {
				return Object.assign({}, deadline, {
					// The task date was set by while dragging by _onDotDragged()
					date: this._formatDate(task.date),
				});
			}

			return deadline;
		});

		this.dispatchEvent(new CustomEvent('deadline-changed', {
			detail: {
				date: task.date,
				taskId: task.taskId,
			},
		}));
	}

	// Check if the task can be moved to a specific date
	_canDrag(task, futureDate) {
		const futureDateStr = this._formatDate(futureDate);

		const index = this._tasks.indexOf(task);

		// Dates can only be moved up to the previous task
		if (index > 0) {
			const minDate = this._tasks[index - 1].dateStr;
			if (futureDateStr < minDate) {
				return false;
			}
		}

		// Dates can only be moved up to the next task
		if (index < this._tasks.length - 1) {
			const maxDate = this._tasks[index + 1].dateStr;
			if (futureDateStr > maxDate) {
				return false;
			}
		}

		return true;
	}

	// Draw labels for each dot
	_drawLabels(x, y, tasks) {
		if (!x || !y || !tasks) {
			return;
		}

		const toLabelText = task => {
			const progress = `${Math.round(task.progress * 100)}%`;
			return `${task.name} (${progress})`;
		};

		const labels = window.d3.select(this.$.svg).select('g').selectAll('.label')
			.data(tasks)
			.attr('x', task => x(task.date) - 16)
			.text(toLabelText);

		labels.enter().append('text')
			.attr('class', 'label')
			.attr('x', task => x(task.date) - 16)
			.attr('y', task => y(task.percentage) + 28)
			.text(toLabelText);

		labels.exit().remove();
	}

	// Positions the line connecting all dots
	_drawValueLine(x, y, tasks) {
		if (!x || !y) {
			return;
		}

		const valueLine = window.d3.line()
			.x(task => x(task.date))
			.y(task => y(task.percentage))(tasks);

		window.d3.select(this.$.valueLine)
			.attr('class', 'line')
			.attr('d', valueLine);
	}

	// Positions the colored area below the tasks line
	_drawColoredArea(x, y, tasks, graphHeight) {
		if (!x || !y) {
			return;
		}

		const area = window.d3.area()
			.x(task => x(task.date))
			.y0(graphHeight)
			.y1(task => y(task.percentage));
		window.d3.select(this.$.area).attr('d', area(tasks));
	}

	// Positions the Today pin and line on the x-axis
	_positionTodayMarker(x, graphHeight, todayDateStr) {
		if (!x || !graphHeight || !todayDateStr) {
			return;
		}

		const todayDate = this._parseDate(todayDateStr);

		const pin = window.d3.select(this.$.todayPin);
		pin
			.data([todayDate])
			// The center of the pin is at half of its size
			.attr('x', date => {
				const widthOffset = pin.attr('width') / 2;
				return x(date) - widthOffset;
			})
			.attr('y', graphHeight - pin.attr('height'));

		window.d3.select(this.$.todayLine)
			.data([todayDate])
			.attr('x1', date => x(date))
			.attr('x2', date => x(date))
			.attr('y1', 0)
			.attr('y2', graphHeight);
	}

	// Positions the gray footer
	_positionFooter(graphHeight, margin) {
		window.d3.select(this.$.footer)
			.attr('y', graphHeight + margin.top)
			.attr('height', margin.bottom);
	}
}
customElements.define(D3TaskScheduler.is, D3TaskScheduler);
