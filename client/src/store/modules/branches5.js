import axios from "axios";
import store from "..";

const API = axios.create({baseURL:"http://localhost:5000/api/branches5"});

const state = {
    branches5:[],
}

const getters = {
    branches5:(state)=>state.branches5,
}

const actions = {
    // Get branches list number 5
    async getBranches5({commit}){
        const data = await API.get('/')
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('getBranches5',data);
    },
    // Get a specific branch
    async getBranch5({commit},id){
        const data = await API.get(`/${id}`)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('getBranch5',data);
    },
    // Add new main branch
    async addBranch5({commit},branch){
        const data = await API.post('/',branch)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('addBranch5',data);
    },
    // Update main branch   
    async updateBranch5({commit},branch){
        const data = await API.patch(`/${branch.id}`,branch)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('updateBranch5',data);
    },
    // Delete main branch
    async deleteBranch5({commit},id){
        const data = await API.delete(`/${id}`)
        .then((res)=>res.data).catch((err)=>console.log(err));
        commit('deleteBranch5',data);
    }
}

const mutations = {
    // Get all list branches number 5
    getBranches5:(state,data)=>{
        state.branches5=data
    },
    // Get a specific branch 
    getBranch5:(state,data)=>{
        if (typeof $ !== 'undefined' && $('.form-control').length) {
            $('.form-control').trumbowyg('html',data.content);
        }
        store.state.oldBranch=data;
        store.state.isUpdate=true;
        store.state.branchType="branch5";
    },
    // Add new branch
    addBranch5:(state,data)=>{
        state.branches5.push(data);
    },
    // Update branch 
    updateBranch5:(state,data)=>{
        state.branches5 = state.branches5.map((branch)=>{
            return branch.id===data.id ? data : branch;
        });
        store.state.isUpdate=false;
    },
    // Delete branch
    deleteBranch5:(state,data)=>{
        state.branches5 = state.branches5.filter((branch)=>{
            return branch.id !== data.id;
        });
    },
    // Update branch show state
    updateBranchShow:(state, {id, isShow}) => {
        state.branches5 = state.branches5.map(branch => 
            branch.id === id ? { ...branch, isShow: isShow !== null ? isShow : !branch.isShow } : branch
        );
    },
    // Reset all isAdd flags
    resetAllIsAdd:(state) => {
        state.branches5 = state.branches5.map(branch => ({ ...branch, isAdd: false }));
    },
    // Set isAdd flag for specific branch
    setIsAdd:(state, id) => {
        state.branches5 = state.branches5.map(branch => 
            branch.id === id ? { ...branch, isAdd: true } : branch
        );
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
