"use strict";
// // console.log('witaj!')
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const test = {};
function notEmpty(target, name) {
    test[target.constructor.name] = Object.assign(Object.assign({}, test[target.constructor.name]), { [name]: 0 });
}
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["ACTIVE"] = 0] = "ACTIVE";
    ProjectStatus[ProjectStatus["FINISHED"] = 1] = "FINISHED";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this._title = title;
        this._id = id;
        this._description = description;
        this._people = people;
        this._status = status;
    }
    get id() {
        return this._id;
    }
    get people() {
        return this._people;
    }
    get description() {
        return this._description;
    }
    get title() {
        return this._title;
    }
    set status(status) {
        this._status = status;
    }
}
__decorate([
    notEmpty
], Project.prototype, "_title", void 0);
__decorate([
    notEmpty
], Project.prototype, "_description", void 0);
__decorate([
    notEmpty
], Project.prototype, "_people", void 0);
function bind(target, name, property) {
    const method = property.value;
    const newPropertyDescriptor = {
        configurable: true,
        get() {
            return method.bind(this);
        }
    };
    return newPropertyDescriptor;
}
class BaseElement {
    constructor(templateId, hostElementId, insertAtStart, elementId) {
        this.container = document.getElementById(hostElementId);
        this.template = document.getElementById(templateId);
        this.hostElementId = hostElementId;
        const importedNode = document.importNode(this.template.content, true);
        this.element = importedNode.firstElementChild;
        if (elementId) {
            this.element.id = elementId;
        }
        this.container.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element);
    }
}
class ProjectInput extends BaseElement {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this._title = this.element.querySelector('#title');
        this._people = this.element.querySelector('#people');
        this._description = this.element.querySelector('#description');
        this.addHandler();
    }
    validate(project) {
        for (const key in test['Project']) {
            if (project[key].toString().trim().length == test["Project"][key]) {
                return false;
            }
        }
        return true;
    }
    handle(event) {
        event.preventDefault();
        const project = new Project(Math.random().toString(), this._title.value, this._description.value, this._people.value, ProjectStatus.ACTIVE);
        this.clear();
        if (this.validate(project)) {
            App.state.registerActiveProject(project);
        }
        else {
            alert('invalid input');
        }
    }
    clear() {
        this._description.value = '';
        this._people.value = '';
        this._title.value = '';
    }
    addHandler() {
        this.element.addEventListener('submit', this.handle);
    }
}
__decorate([
    bind
], ProjectInput.prototype, "handle", null);
class ProjectList extends BaseElement {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this._projects = this.element.querySelector('ul');
        this._projects.id = `${this.type}-projects-list`;
        const h2 = this.element.querySelector('h2');
        h2.textContent = this.type.toUpperCase() + ' PROJECTS';
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
    }
    dragOverHandler(event) {
        if (event.dataTransfer && 'text/plain' === event.dataTransfer.types[0]) {
            event.preventDefault();
            this._projects.classList.add('droppable');
        }
    }
    dropHandler(event) {
        if (event.dataTransfer.getData('hostElementId') != this._projects.id) {
            const id = event.dataTransfer.getData('text/plain');
            if (this.type === 'finished') {
                App.state.unregisterActiveProject(id);
            }
            else {
                App.state.unregisterFinishedProject(id);
            }
        }
        this._projects.classList.remove('droppable');
    }
    dragLeaveHandler(event) {
        this._projects.classList.remove('droppable');
    }
    notify() {
        this.refresh();
    }
    refresh() {
        this._projects.innerHTML = '';
        if (this.type === 'active') {
            for (const project of App.state.activeProjects) {
                new SingleProject(project, this._projects.id);
            }
        }
        else {
            for (const project of App.state.finishedProjects) {
                new SingleProject(project, this._projects.id);
            }
        }
    }
}
__decorate([
    bind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    bind
], ProjectList.prototype, "dropHandler", null);
__decorate([
    bind
], ProjectList.prototype, "dragLeaveHandler", null);
class SingleProject extends BaseElement {
    constructor(project, hostElementId) {
        super('single-project', hostElementId, false, project.id);
        this.project = project;
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('h3').textContent = this.project.description;
        this.element.querySelector('p').textContent = this.project.people;
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    dragStartHandler(event) {
        event.dataTransfer.setData('text/plain', this.project.id);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('hostElementId', this.hostElementId);
    }
    dragEndHandler(event) {
    }
}
__decorate([
    bind
], SingleProject.prototype, "dragStartHandler", null);
__decorate([
    bind
], SingleProject.prototype, "dragEndHandler", null);
class App {
    constructor() {
        this.activeProjectObservers = [];
        this.finishedProjectObservers = [];
        this._activeProjects = [];
        this._finishedProjects = [];
    }
    static get state() {
        return App._state;
    }
    get activeProjects() {
        return this._activeProjects;
    }
    get finishedProjects() {
        return this._finishedProjects;
    }
    registerActiveProject(project) {
        this._activeProjects.push(project);
        for (const observer of this.activeProjectObservers) {
            observer.notify();
        }
    }
    unregisterActiveProject(id) {
        const project = this.activeProjects.find(p => {
            return id === p.id;
        });
        if (project) {
            this.registerFinishedProject(this.activeProjects.splice(this.activeProjects.indexOf(project), 1)[0]);
        }
        for (const observer of this.activeProjectObservers) {
            observer.notify();
        }
    }
    unregisterFinishedProject(id) {
        const project = this.finishedProjects.find(p => {
            return id === p.id;
        });
        if (project) {
            this.registerActiveProject(this.finishedProjects.splice(this.finishedProjects.indexOf(project), 1)[0]);
        }
        for (const observer of this.finishedProjectObservers) {
            observer.notify();
        }
    }
    registerFinishedProject(project) {
        this._finishedProjects.push(project);
        for (const observer of this.finishedProjectObservers) {
            observer.notify();
        }
    }
    subscribeToActive(projectList) {
        this.activeProjectObservers.push(projectList);
    }
    subscribeToFinished(projectList) {
        this.finishedProjectObservers.push(projectList);
    }
}
App._state = new App();
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
App.state.subscribeToActive(activeProjectList);
App.state.subscribeToFinished(finishedProjectList);
//# sourceMappingURL=app.js.map