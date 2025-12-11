<template>
    <ul class="menu context-menu">
        <li @click.stop="handleAdding" v-if="deleteData !== 'branch5'">Add new Branch</li>
        <li @click.stop="handleDelete">Delete Branch</li>
    </ul>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'ActionsMenu',
    props: ['branchId', 'branch', 'addData', 'deleteData'],
    methods: {
        ...mapActions({
            deleteBranch1: 'branches1/deleteBranch1',
            getBranches1: 'branches1/getBranches1',
            deleteBranch2: 'branches2/deleteBranch2',
            getBranches2: 'branches2/getBranches2',
            deleteBranch3: 'branches3/deleteBranch3',
            getBranches3: 'branches3/getBranches3',
            deleteBranch4: 'branches4/deleteBranch4',
            getBranches4: 'branches4/getBranches4',
            deleteBranch5: 'branches5/deleteBranch5',
            getBranches5: 'branches5/getBranches5'
        }),
        handleAdding() {
            this.$store.commit('setType', { type: this.addData, data: this.branch });
            this.$store.commit('hideShowMenu');
        },
        handleDelete() {
            this.$store.commit('hideShowMenu');
            const isDelete = confirm('Are you sure you want to delete this branch?');
            if (isDelete) {
                switch (this.deleteData) {
                    case 'branch1':
                        this.deleteBranch1(this.branchId);
                        setTimeout(() => this.getBranches1(), 100);
                        break;
                    case 'branch2':
                        this.deleteBranch2(this.branchId);
                        setTimeout(() => this.getBranches2(), 100);
                        break;
                    case 'branch3':
                        this.deleteBranch3(this.branchId);
                        setTimeout(() => this.getBranches3(), 100);
                        break;
                    case 'branch4':
                        this.deleteBranch4(this.branchId);
                        setTimeout(() => this.getBranches4(), 100);
                        break;
                    case 'branch5':
                        this.deleteBranch5(this.branchId);
                        setTimeout(() => this.getBranches5(), 100);
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
</script>

<style scoped>
.context-menu {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 150px;
    padding: 5px 0;
    margin: 0;
    list-style: none;
}

.context-menu li {
    padding: 8px 15px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.context-menu li:hover {
    background-color: #f5f5f5;
}

.context-menu li:active {
    background-color: #e0e0e0;
}
</style>
