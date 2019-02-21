import React, { Component } from 'react';
import '../App.css';
import { Dropdown, Button, Icon, Label } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

class NewExamSelection extends Component {

    constructor(props) {
        super(props);

        const studiesArray = Object.keys(props.store.alleModule)
        const studiesOptions = []
        for (let i = 0; i < studiesArray.length; i++) {
            studiesOptions.push({
                key: studiesArray[i],
                value: studiesArray[i],
                text: studiesArray[i].toUpperCase(),
            })
        }

        this.state = {
            studiesOptions: studiesOptions,
            coursesOptions: this.getAvailableCourses(props.store.studies),
            selectedCourse: null,
            selectedStudy: props.store.studies
        }

        props.store.subscribe(store => {
            this.setState({ store: store });
        });
    }

    examAlreadyTaken = (course) => {
        const takenExams = this.props.store.leistungen.angemeldet.concat(this.props.store.leistungen.bestanden)
        for (let i = 0; i < takenExams.length; i++) {
            if (takenExams[i].edvNr === course.edvNr) return true
        }
        return false
    }

    examAlreadyAdded = (course) => {
        const addedExams = this.props.store.leistungen.hinzugefuegt;
        for (const i in addedExams) {
            if (addedExams[i].edvNr === course.edvNr) return true
        }
        return false
    }

    getAvailableCourses = (studies) => {
        const courses = []
        for (let i = 0; i < this.props.store.alleModule[studies].length; i++) {
            const course = this.props.store.alleModule[studies][i]

            if (course.ects !== 0 && !this.examAlreadyTaken(course) && !this.examAlreadyAdded(course)) {
                courses.push({
                    key: course.edvNr,
                    value: course.edvNr,
                    text: course.name,
                    content: (
                        <span>
                            {course.name}
                            <Label className='option-label' circular>{course.ects}</Label>
                        </span>
                    )
                })
            }
        }

        return courses
    }

    updateCourseDropdown = (event, data) => {
        this.setState({
            selectedStudy: data.value,
            coursesOptions: this.getAvailableCourses(data.value)
        })
    }

    updateSelectedCourse = (event, data) => {
        this.setState({
            selectedCourse: data.value
        })
    }

    addExam = () => {
        for (const i in this.props.store.alleModule[this.state.selectedStudy]) {
            const modul = this.props.store.alleModule[this.state.selectedStudy][i]
            if (modul.edvNr === this.state.selectedCourse) {
                this.props.store.leistungen.hinzugefuegt.push(modul)
                break
            }
        }

        this.props.store.notify()

        this.setState({
            coursesOptions: this.getAvailableCourses(this.state.selectedStudy)
        })

        console.log(this.props.store.leistungen.hinzugefuegt)
    }

    render() {
        return (
            <table id='newExamSelection'>
                <thead>
                    <tr>
                        <th>Studieng.</th>
                        <th>Modul</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='studiesDropdownWrapper'>
                            <Dropdown fluid search selection
                                      defaultValue={this.props.store.studies}
                                      options={this.state.studiesOptions}
                                      onChange={this.updateCourseDropdown} />
                        </td>
                        <td>
                            <Dropdown fluid search selection
                                      placeholder='Modul auswählen'
                                      options={this.state.coursesOptions}
                                      value={this.state.selectedCourse}
                                      onChange={this.updateSelectedCourse} />
                        </td>
                        <td>
                            <Icon name='plus circle' onClick={this.addExam} />
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
}

export default NewExamSelection;
