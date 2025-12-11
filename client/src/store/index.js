import { createStore } from 'vuex';
import branches1 from './modules/branches1';
import branches2 from './modules/branches2';
import branches3 from './modules/branches3';
import branches4 from './modules/branches4';
import branches5 from './modules/branches5';

const store = createStore({
    state: {
        isEditor: false,
        branchType: null,
        isUpdate: false,
        oldBranch: null,
        b1: false,
        b2: false,
        b3: false,
        b4: false,
        b5: false,
        selectedParentId: null // Add this to track parent branch
    },
    mutations: {
        // Show/hide list mutations
        showList1: (state, id) => {
            // Access branches through the module
            const branches = store.state.branches1.branches1;
            if (branches && Array.isArray(branches)) {
                store.commit('branches1/updateBranchShow', { id, isShow: null });
            }
        },
        showList2: (state, id) => {
            const branches = store.state.branches2.branches2;
            if (branches && Array.isArray(branches)) {
                store.commit('branches2/updateBranchShow', { id, isShow: null });
            }
        },
        showList3: (state, id) => {
            const branches = store.state.branches3.branches3;
            if (branches && Array.isArray(branches)) {
                store.commit('branches3/updateBranchShow', { id, isShow: null });
            }
        },
        showList4: (state, id) => {
            const branches = store.state.branches4.branches4;
            if (branches && Array.isArray(branches)) {
                store.commit('branches4/updateBranchShow', { id, isShow: null });
            }
        },
        showList5: (state, id) => {
            const branches = store.state.branches5.branches5;
            if (branches && Array.isArray(branches)) {
                store.commit('branches5/updateBranchShow', { id, isShow: null });
            }
        },
        
        // Show menu mutations
        showMenu1: (state, id) => {
            // Hide all other menus first
            state.b1 = false;
            state.b2 = false;
            state.b3 = false;
            state.b4 = false;
            state.b5 = false;
            
            // Reset all isAdd flags through module mutations
            store.commit('branches1/resetAllIsAdd');
            store.commit('branches2/resetAllIsAdd');
            store.commit('branches3/resetAllIsAdd');
            store.commit('branches4/resetAllIsAdd');
            store.commit('branches5/resetAllIsAdd');
            
            // Show menu for specific branch
            store.commit('branches1/setIsAdd', id);
            state.b1 = true;
        },
        showMenu2: (state, id) => {
            state.b1 = false;
            state.b2 = false;
            state.b3 = false;
            state.b4 = false;
            state.b5 = false;
            
            store.commit('branches1/resetAllIsAdd');
            store.commit('branches2/resetAllIsAdd');
            store.commit('branches3/resetAllIsAdd');
            store.commit('branches4/resetAllIsAdd');
            store.commit('branches5/resetAllIsAdd');
            
            store.commit('branches2/setIsAdd', id);
            state.b2 = true;
        },
        showMenu3: (state, id) => {
            state.b1 = false;
            state.b2 = false;
            state.b3 = false;
            state.b4 = false;
            state.b5 = false;
            
            store.commit('branches1/resetAllIsAdd');
            store.commit('branches2/resetAllIsAdd');
            store.commit('branches3/resetAllIsAdd');
            store.commit('branches4/resetAllIsAdd');
            store.commit('branches5/resetAllIsAdd');
            
            store.commit('branches3/setIsAdd', id);
            state.b3 = true;
        },
        showMenu4: (state, id) => {
            state.b1 = false;
            state.b2 = false;
            state.b3 = false;
            state.b4 = false;
            state.b5 = false;
            
            store.commit('branches1/resetAllIsAdd');
            store.commit('branches2/resetAllIsAdd');
            store.commit('branches3/resetAllIsAdd');
            store.commit('branches4/resetAllIsAdd');
            store.commit('branches5/resetAllIsAdd');
            
            store.commit('branches4/setIsAdd', id);
            state.b4 = true;
        },
        showMenu5: (state, id) => {
            state.b1 = false;
            state.b2 = false;
            state.b3 = false;
            state.b4 = false;
            state.b5 = false;
            
            store.commit('branches1/resetAllIsAdd');
            store.commit('branches2/resetAllIsAdd');
            store.commit('branches3/resetAllIsAdd');
            store.commit('branches4/resetAllIsAdd');
            store.commit('branches5/resetAllIsAdd');
            
            store.commit('branches5/setIsAdd', id);
            state.b5 = true;
        },
        
        // Hide the menu when it clicked by Adding or deleting
        hideShowMenu: (state) => {
            state.b1 = false;
            state.b2 = false;
            state.b3 = false;
            state.b4 = false;
            state.b5 = false;
            
            // Reset all isAdd flags through module mutations
            store.commit('branches1/resetAllIsAdd');
            store.commit('branches2/resetAllIsAdd');
            store.commit('branches3/resetAllIsAdd');
            store.commit('branches4/resetAllIsAdd');
            store.commit('branches5/resetAllIsAdd');
        },
        
        // Reset to add new main branch
        resetToAdd: (state) => {
            state.oldBranch = null;
            state.branchType = "branch1";
            state.isUpdate = false;
            state.selectedParentId = null; // Reset parent ID
            if (typeof $ !== 'undefined' && $('.form-control').length) {
                $('.form-control').trumbowyg('html', `<h1 class="branch-name" id="branch-name"></h1>`);
            }
        },
        
        // Set type of branch => prepare to add new branch in main branch
        setType: (state, { type, data }) => {
            state.branchType = type;
            state.oldBranch = data;
            state.isUpdate = false;
            state.selectedParentId = data ? data.id : null; // Set parent ID
            if (typeof $ !== 'undefined' && $('.form-control').length) {
                $('.form-control').trumbowyg('html', `<h1 class="branch-name" id="branch-name"></h1>`);
            }
        },
        
        // Open text editor
        openEditor: (state) => {
            state.isEditor = true;
            state.branchType = "branch1";
        },
        
        // Close text editor
        closeEditor: (state) => {
            state.isEditor = false;
            state.branchType = null;
            state.isUpdate = false;
            state.oldBranch = null;
            if (typeof $ !== 'undefined' && $('.form-control').length) {
                $('.form-control').trumbowyg('html', `<h1 class="branch-name" id="branch-name"></h1>`);
            }
        }
    },
    modules: {
        branches1,
        branches2,
        branches3,
        branches4,
        branches5
    }
});

export default store;
