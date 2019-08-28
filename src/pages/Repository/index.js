import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import { Container } from '../../components/Container/index';
import { Owner } from '../../components/Owner/index';
import { Loading } from './styles';

export default class Repository extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                repository: PropTypes.string,
            }),
        }).isRequired,
    };

    state = {
        repository: {},
        issues: [],
        isLoading: true,
    };

    async componentDidMount() {
        const { match } = this.props;
        const repo = decodeURIComponent(match.params.repository);
        const [repository, issues] = await Promise.all([
            api.get(`/repos/${repo}`),
            api.get(`/repos/${repo}/issues`, {
                params: {
                    state: 'open',
                    per_page: 5,
                },
            }),
        ]);

        this.setState({
            repository: repository.data,
            issues: issues.data,
            isLoading: false,
        });
    }

    render() {
        const { repository, issues, isLoading } = this.state;

        if (isLoading) {
            return <Loading>Carregando...</Loading>;
        }
        return (
            <Container>
                <Owner>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />
                    <h1>{repository.name}</h1>
                </Owner>
                Repository
            </Container>
        );
    }
}
