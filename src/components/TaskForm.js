import React, { Component } from 'react';
import TaskService from '../api/TaskService';
import { Redirect } from 'react-router-dom';
import AuthService from '../api/AuthService';
import Spinner from './Spinner';
import Alert from './Alert'

class TaskForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: {
                id: 0,
                apartamento: "",
                nome: "",
                qtdeHospede : 0,
                dataCheckin : "",
                done : false
            },
            redirect: false,
            buttonName: "Cadastrar",
            alert: null,
            loading: false,
            saving: false
        }
        
        this.onSubmitHandler = this.onSubmitHandler.bind(this);
        this.onInputChangeHandler = this.onInputChangeHandler.bind(this);
    }

    componentDidMount() {
        const editId = this.props.match.params.id;
        if (editId) {
            this.setState({ loading: true});
            TaskService.load(~~editId,
                task => this.setState({ task : task, loading: false, buttonName: "Alterar" }),
                error => {
                    if (error.response) {
                        if (error.response.status === 404) {
                            this.setErrorState("Tarefa não encontrada");
                        } else {
                            this.setErrorState(`Erro ao carregar dados: ${error.response}`);
                        }
                    } else {
                        this.setErrorState(`Erro na requisição: ${error.message}`);
                    }
                });
        }
    }

    setErrorState(error) {
        this.setState({ alert: error, loading: false, saving: false });
    }

    onSubmitHandler(event) {
        event.preventDefault();
        this.setState({ saving: true, alert: null });
        TaskService.save(this.state.task,
            () => this.setState({ redirect : true, saving: false }),
            error => {
                if (error.response) {
                    this.setErrorState(`Erro: ${error.response.data.error}`);
                } else {
                    this.setErrorState(`Erro na requisição: ${error.message}`);
                }
            })
    }

    onInputChangeHandler(event) {
        const field = event.target.name;
        const value = event.target.value;
        this.setState(prevState => ({ task: { ...prevState.task, [field]: value }}));
    }

    render() {
        if (!AuthService.isAuthenticated()) {
            return <Redirect to="/login" />
        }
        
        if (this.state.redirect) {
            return <Redirect to="/" />
        }

        if (this.state.loading) {
            return <Spinner />
        }

        return (
            <div>
                <h1>Cadastro da Tarefa</h1>
                { this.state.alert != null ? <Alert message={this.state.alert} /> : "" }
                <form onSubmit={this.onSubmitHandler}>
                    <div className="form-group">
                        <label htmlFor="apartamento">Apartamento</label>
                        <input type="text"
                            className="form-control"
                            name="apartamento"
                            value={this.state.task.apartamento}
                            placeholder="Digite o apartamento"
                            onChange={this.onInputChangeHandler} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Nome">Nome do hóspede</label>
                        <input type="text"
                            className="form-control"
                            name="nome"
                            value={this.state.task.nome}
                            placeholder="Digite o nome do hóspede"
                            onChange={this.onInputChangeHandler} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="qtdeHospede">Qtde de hóspede(s)</label>
                        <input type="text"
                            className="form-control"
                            name="qtdeHospede"
                            value={this.state.task.qtdeHospede}
                            placeholder="Digite a quantidade de hóspede(s)"
                            onChange={this.onInputChangeHandler} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dataCheckin">Data Check-In</label>
                        <input type="date"
                            className="form-control"
                            name="dataCheckin"
                            value={this.state.task.dataCheckin}
                            placeholder="Informe a data do Check-In"
                            onChange={this.onInputChangeHandler} />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={this.state.saving}>
                            {
                                this.state.saving ?
                                    <span className="spinner-border spinner-border-sm"
                                        role="status" aria-hidden="true">
                                    </span>
                                : this.state.buttonName 
                            }
                        </button>
                    &nbsp;&nbsp;
                    <button
                        type="button"
                        className="btn btn-primary"
                        disabled={this.state.saving}
                        onClick={() => this.setState({ redirect: true })}>
                            Cancelar
                        </button>
                </form>
            </div>
        );
    }
}

export default TaskForm;