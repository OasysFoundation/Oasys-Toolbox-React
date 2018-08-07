const Tree = class {
    constructor(params){
        const presets = {
            parent: null
        }
        Object.assign(this, presets, params)
        this.setChildNodes();
    }

    setChildNodes() {
        if (!this.children) {
            return
        }
        const that = this;
        this.children = this.children.map(function (child) {
            if (child.length) {
                return new Tree({name: child, children: null, parent: that})
            }
            return new Tree(Object.assign(child, {parent: that}))
        })
    }
    overrideChildProps(prop, value) {
        //recursively overrides all children(R) with value
        if (!this.children) {
            return;
        }
        this.children.forEach(c => {
            c[prop] = value;
            c.overrideChildProps(prop, value)
            console.log(`Set ${prop} of ${c.name} to ${value}`)
        })
    }
    setParentsProperty(prop, value) {
        if (!this.parent) {
            return;
        }
        this.parent[prop] = value;
        console.log(`Set ${prop} of ${this.parent.name} to ${value}`)
        this.parent.setParentsProperty(prop, value)
    }
    findNodeInChildren(id) {
        //BS code....
        if (this.name === id) {
            return this;
        }
        else if (this.children) {
            const nodes = this.children.map(c => c.findNodeInChildren(id));
            return nodes.filter(n => n != null)[0]
        }
        else {return null}
    }

    findNodesWithProp(prop, value, arr = []) {
        let that = this;
        const memory = [that.name];
        let active = true;
        while (that.children!==undefined && that.children!==null && that.children.length>0 && active) {
            active = false;
            let temp = this;
            that.children.forEach(c=> {
                if (c[prop] === value) {
                    memory.push(c.name);
                    temp = c;
                    active = true;
                }
            })
            that = temp;
        }
        return memory;
    }
}

export default Tree;