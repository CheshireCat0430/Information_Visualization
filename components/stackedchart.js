class Stackedchart {
    margin = {
        top: 10, right: 100, bottom: 40, left: 40
    }

    constructor(svg, data, width = 1000, height = 1000) {
        this.svg = svg;
        this.data = data;
        this.width = width;
        this.height = height;

        this.handlers = {};
    }
    initialize() {
        this.svg = d3.select(this.svg);
        // this.container = this.svg.append("g");
        // this.xAxis = this.svg.append("g");
        // this.yAxis = this.svg.append("g");
        this.legend = this.svg.append("g");

        // this.xScale = d3.scaleLinear();
        // this.yScale = d3.scaleLinear();
        // this.zScale = d3.scaleOrdinal().range(d3.schemeCategory10)

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        // this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    }

    update(yVar, colorVar) {
        let brands = this.data.map(d => (d.brand))
        let datas = this.data.map(d => (d.ssd))
        let result = {};
        for(let i = 0; i < brands.length; i++){
            if(result[brands[i]]) {
                if(result[brands[i]][datas[i]]) {
                    result[brands[i]][datas[i]] = result[brands[i]][datas[i]] + 1;
                }else {
                    result[brands[i]][datas[i]] = 0 + 1;
                }
            }else {
                result[brands[i]] = {};
                if(result[brands[i]][datas[i]]) {
                    result[brands[i]][datas[i]] = result[brands[i]][datas[i]] + 1;
                }else {
                    result[brands[i]][datas[i]] = 0 + 1;
                }
            }
        }
        let datas_set = []
        datas.forEach((x) => { 
            if(!datas_set.includes(x)){
                datas_set.push(x)
            }
        });

        let brand_set = []
        brands.forEach((x) => { 
            if(!brand_set.includes(x)){
                brand_set.push(x)
            }
        });
        // datas_set.unshift('brand')
        
        let result_csv = []

        for(var key in result){
            let cnt = {}
            cnt['brand'] = key
            datas_set.forEach((x) => {
                cnt[x] = 0
            })
            for(var key2 in result[key]){
                cnt[key2] += result[key][key2]
            }
            result_csv.push(cnt)
        }
        
        this.subgroups = datas_set
        this.groups = data.map(d => (d.brand))
        
        this.x = d3.scaleBand()
            .domain(this.groups)
            .range([0, this.width])
            .padding([0.2])
        this.svg.append("g")
            .attr("transform", `translate(0, ${this.height})`)
            .call(d3.axisBottom(this.x).tickSizeOuter(0));
            
        // Add Y axis
        this.y = d3.scaleLinear()
            .domain([0, 200])
            .range([ this.height, 0 ]);
        this.svg.append("g")
            .call(d3.axisLeft(this.y));
                
        // color palette = one color per subgroup
        let color = d3.scaleOrdinal()
            .domain(this.subgroups)
            .range(d3.schemeCategory10)
            
        console.log(result_csv)
        // this.legend = this.svg.append("g")
        //     .attr("transform", "translate(800, 30)")
        //     .call(d3.legendColor().scale(color))
        
        //stack the data? --> stack per subgroup
        this.stackedData = d3.stack().keys(this.subgroups)(result_csv)
        
        
        // Show the bars
        this.svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(this.stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .join("rect")
        .attr("x", d => this.x(d.data.brand))
                .attr("y", d => this.y(d[1]))
                .attr("height", d => this.y(d[0]) - this.y(d[1]))
                .attr("width",this.x.bandwidth())
        console.log(this.stackedData)
    }

    on(eventType, handler) {
        this.handlers[eventType] = handler;
    }
}