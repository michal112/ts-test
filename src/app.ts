

// // console.log('witaj!')

// // enum Role {
// //     ADMIN,
// //     AUTHOR
// // }
// // const o: {
// //     name: string | number | boolean | { name: string };
// //     age: number;
// //     role: [number, string]
// // } = {
// //     name: {name: 'Michał'},
// //     age: 30,
// //     role: [1, 'author'],
// // }
// // function handle(this: string, message: string) {
// //     console.log(this + message)
// // }
// // const button = document.querySelector('button')!
// // button.addEventListener('click', handle.bind('e', 's'))
// // function add(n1: number, n2: number, callback: (arg0: number) => {result: number}) {
// //     let result = n1 + n2
// //     return callback(result)
// // }
// // function callback(n1: number) {
// //     return {
// //         result: n1
// //     } 
// // }
// // console.log(add(4, 5, callback))
// // o.role.push(2)
// // o.role.push('admin')

// // console.log(o.name)

// // class Department {
// //     name: string

// //     constructor(n: string) {
// //         this.name = n
// //     }

// //     describe(this: Department) {
// //         console.log("nazwa " + this.name)
// //     }
// // }

// // const accounting = new Department('accounting')
// // accounting.describe()
// // const copy = {describe:accounting.describe}
// // copy.describe.bind(accounting)()

// enum Hobby {
//     BOOKS = 1,
//     CHESS,
//     GAMES
// }

// @decor('paragraph')
// class User {

//     constructor(private name: string, private age: number, private hobby: Hobby) {}

//     set setName(value: string) {
//         this.name = value
//     }

//     set setAge(value: number) {
//         this.age = value
//     }

//     set setHobby(value: Hobby) {
//         this.hobby = value
//     }

//     get getName() {
//         return this.name
//     }

//     get getAge() {
//         return this.age
//     }

//     get getHobby() {
//         return this.hobby
//     }
// }

// // const sortUsers = (users: User[], predicate: (user: User) => boolean) => {
// //     return users.filter(predicate)
// // }

// const sortUsers = (users: User[], condition: { field: string, value: any }) => {
//     return users.filter(user => {
//         let keys = Object.keys(user)
//         keys.every
//         const field = keys.find(key => { return key === condition.field }) as keyof User
//         return user[field] == condition.value
//     })
// }

// // let user = sortUsers(users,  (user: User) => { return user.getHobby === Hobby.GAMES });
// // console.log(user)
// // let user = sortUsers(users,  { field: 'hobby', value: Hobby.GAMES });
// // console.log(user)

// function decor(id: string) {
//     return function<T extends {new(...args: any[]): User}>(constructor: T) {
//         return class extends constructor {
//             constructor(...args: any[]) {
//                 super(args);
//                 let p = document.getElementById(id)!
//                 p.innerHTML = this.getName
//             }
//         }
//     }
// }
// const button = document.getElementById('www')!
// button.addEventListener('click', () => {
//     const users = [
//         new User('Michal', 30, Hobby.CHESS),
//         new User('Magda', 30, Hobby.BOOKS),
//         new User('Mateusz', 30, Hobby.GAMES)
//     ]
// })

// interface Test {
//     [prop: string]: {
//         [p: string]: number
//     }
// }
// const test: Test = {};

// class Course {
//     @GreaterThan(1)
//     private _price: number

//     constructor(price: number) {
//         this._price = price
//     }

//     getPrice() {
//         return this._price
//     }
// }

// function GreaterThan(n: number) {
//     return function(target: any, name: string) {
//         test[target.constructor.name] = {
//             [name]: n
//         }
//     }
// }
// function validate(c: any) {
//     for (const key in test["Course"]) {
//         return c[key] > test["Course"][key]
//     }
// }
// const form = document.querySelector('form')!
// form.addEventListener('submit', event => {
//     event.preventDefault()
//     let field = document.getElementById('price') as HTMLInputElement
//     let c = new Course(+field.value)
//     if (!validate(c)) {
//         alert('validation error')
//     }
//     console.log(c)
// })

interface Draggable {
    dragStartHandler(event: DragEvent): void
    dragEndHandler(event: DragEvent): void
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void
    dropHandler(event: DragEvent): void
    dragLeaveHandler(event: DragEvent): void
}

interface Test {
    [prop: string]: {
        [prop2: string]: number
    }
}

const test: Test = {}

function notEmpty(target: any, name: string) {
    test[target.constructor.name] = {
        ...test[target.constructor.name],
        [name]: 0 
    }
}

enum ProjectStatus {
    ACTIVE,
    FINISHED
}

class Project {

    private _id: string
    @notEmpty
    private _title: string
    @notEmpty
    private _description: string
    @notEmpty
    private _people: string
    private _status: ProjectStatus

    constructor(id: string, title: string, description: string, people: string, status: ProjectStatus) {
        this._title = title
        this._id = id
        this._description = description
        this._people = people
        this._status = status
    }

    get id() {
        return this._id
    }

    get people() {
        return this._people
    }

    get description() {
        return this._description
    }

    get title() {
        return this._title
    }

    set status(status: ProjectStatus) {
        this._status = status;
    }
}

function bind(target: any, name: string, property: PropertyDescriptor) {
    const method = property.value;
    const newPropertyDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            return method.bind(this)
        }
    }
    return newPropertyDescriptor
}

abstract class BaseElement<T extends HTMLElement, U extends HTMLElement> {
    
    protected template: HTMLTemplateElement
    protected container: T
    protected element: U    
    protected hostElementId: string

    constructor(templateId: string, hostElementId: string, insertAtStart: boolean, elementId?: string) {
        this.container = document.getElementById(hostElementId) as T
        this.template = document.getElementById(templateId) as HTMLTemplateElement
        this.hostElementId = hostElementId

        const importedNode = document.importNode(this.template.content, true)
        this.element = importedNode.firstElementChild as U
        if (elementId) {
            this.element.id = elementId
        }
        this.container.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.element)
    }
}

class ProjectInput extends BaseElement<HTMLDivElement, HTMLFormElement> {
    
    private _title: HTMLInputElement
    private _description: HTMLTextAreaElement
    private _people: HTMLInputElement

    constructor() {
        super('project-input', 'app', true, 'user-input')

        this._title = this.element.querySelector('#title') as HTMLInputElement
        this._people = this.element.querySelector('#people') as HTMLInputElement
        this._description = this.element.querySelector('#description') as HTMLTextAreaElement

        this.addHandler()
    }

    private validate(project: any) {
        for(const key in test['Project'])  {
            if (project[key].toString().trim().length == test["Project"][key]) {
                return false
            } 
        }
        return true
    }

    @bind
    private handle(event: Event) {
        event.preventDefault()
        const project = new Project(
            Math.random().toString(),
            this._title.value,
            this._description.value, 
            this._people.value,
            ProjectStatus.ACTIVE)
        this.clear()
        if (this.validate(project)) {
            App.state.registerActiveProject(project)
        } else {
            alert('invalid input')
        }
    }

    private clear() {
        this._description.value = ''
        this._people.value = ''
        this._title.value = ''
    }

    private addHandler() {
        this.element.addEventListener('submit', this.handle)    
    }
}

interface Observer {
    notify(): void
}

class ProjectList extends BaseElement<HTMLDivElement, HTMLElement> implements Observer, DragTarget {
    private _projects: HTMLUListElement

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        
        this._projects = this.element.querySelector('ul') as HTMLUListElement
        this._projects.id = `${this.type}-projects-list`

        const h2 = this.element.querySelector('h2') as HTMLElement
        h2.textContent = this.type.toUpperCase() + ' PROJECTS'

        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)
    }

    @bind
    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer && 'text/plain' === event.dataTransfer.types[0]) {
            event.preventDefault()
            this._projects.classList.add('droppable')
        }
    }

    @bind
    dropHandler(event: DragEvent): void {
        if (event.dataTransfer!.getData('hostElementId') != this._projects.id) {
            const id = event.dataTransfer!.getData('text/plain')
            if (this.type === 'finished') {
                App.state.unregisterActiveProject(id)
            } else {
                App.state.unregisterFinishedProject(id)
            }
        }
        this._projects.classList.remove('droppable')
    }

    @bind
    dragLeaveHandler(event: DragEvent): void {
        this._projects.classList.remove('droppable')
    }
    
    notify(): void {
        this.refresh()
    }

    public refresh() {
        this._projects.innerHTML = ''
        if (this.type === 'active') {
            for (const project of App.state.activeProjects) {
                new SingleProject(project, this._projects.id)
            }
        } else {
            for (const project of App.state.finishedProjects) {
                new SingleProject(project, this._projects.id)
            }
        }
    }
}

class SingleProject extends BaseElement<HTMLUListElement, HTMLLIElement>  implements Draggable {

    constructor(private project: Project, hostElementId: string) {
        super('single-project', hostElementId, false, project.id)

        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = this.project.description
        this.element.querySelector('p')!.textContent = this.project.people
    
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }

    @bind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id)
        event.dataTransfer!.effectAllowed = 'move'
        event.dataTransfer!.setData('hostElementId', this.hostElementId)
    }

    @bind
    dragEndHandler(event: DragEvent): void {
    }
}

class App {
    
    private activeProjectObservers: Observer[]
    private finishedProjectObservers: Observer[]
    private _activeProjects: Project[]
    private _finishedProjects: Project[]
    private static _state = new App()

    static get state() {
        return App._state
    }

    get activeProjects() {
        return this._activeProjects
    }

    get finishedProjects() {
        return this._finishedProjects
    }

    private constructor() {
        this.activeProjectObservers = []
        this.finishedProjectObservers = []
        this._activeProjects = []
        this._finishedProjects = []
    }

    public registerActiveProject(project: Project) {
        this._activeProjects.push(project)
        for (const observer of this.activeProjectObservers) {
            observer.notify()
        }
    }

    public unregisterActiveProject(id: string) {
        const project = this.activeProjects.find(p => {
            return id === p.id
        })
        if (project) {
            this.registerFinishedProject(
                this.activeProjects.splice(
                    this.activeProjects.indexOf(project), 1
                )[0]
            )
        }
        for (const observer of this.activeProjectObservers) {
            observer.notify()
        }
    }

    public unregisterFinishedProject(id: string) {
        const project = this.finishedProjects.find(p => {
            return id === p.id
        })
        if (project) {
            this.registerActiveProject(
                this.finishedProjects.splice(
                    this.finishedProjects.indexOf(project), 1
                )[0]
            )
        }
        for (const observer of this.finishedProjectObservers) {
            observer.notify()
        }
    }

    private registerFinishedProject(project: Project) {
        this._finishedProjects.push(project)
        for (const observer of this.finishedProjectObservers) {
            observer.notify()
        }
    }

    public subscribeToActive(projectList: ProjectList) {
        this.activeProjectObservers.push(projectList)
    }

    public subscribeToFinished(projectList: ProjectList) {
        this.finishedProjectObservers.push(projectList)
    }
}

const projectInput = new ProjectInput()
const activeProjectList = new ProjectList('active')
const finishedProjectList = new ProjectList('finished')

App.state.subscribeToActive(activeProjectList)
App.state.subscribeToFinished(finishedProjectList)