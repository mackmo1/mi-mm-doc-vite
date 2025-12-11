<template>
    <div class="my-editor">
        <button name="submit" @click="handleSubmit">
            <i class="fa fa-check-circle" aria-hidden="true" title="Update The Branch" v-if="isUpdate"></i>
            <i class="fa fa-plus-circle" aria-hidden="true" title="Add New Branch" v-else></i>
        </button>
        <trumbowyg v-model="form.content" :config="configs" class="form-control"></trumbowyg>
    </div>
</template>

<script>
import {mapActions,mapState} from 'vuex';
import Trumbowyg from 'vue-trumbowyg';
import 'trumbowyg/dist/ui/trumbowyg.css';
import 'trumbowyg/dist/plugins/colors/trumbowyg.colors';
import 'trumbowyg/dist/plugins/colors/ui/trumbowyg.colors.css';
import "trumbowyg/dist/plugins/history/trumbowyg.history.min.js";
import "trumbowyg/dist/plugins/base64/trumbowyg.base64.min.js";

export default{
    name:'Editor',

    components: {
      "trumbowyg": Trumbowyg
    },

    data(){
        return{
            form:{
                content: `<h1 class="branch-name" id="branch-name"></h1>` ,
                body:null
            },
            configs: {
                autogrow: true,
                removeformatPasted: true,
                imageWidthModalEdit: true,
                btns: [
                    ['viewHTML'],
                    ['historyUndo', 'historyRedo'],
                    ['formatting'],
                    ['bold', 'italic'],
                    ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                    ['foreColor'], ['backColor'],
                    ['indent', 'outdent'],
                    ['horizontalRule'],
                    ['unorderedList', 'orderedList'],
                    ['superscript', 'subscript'],
                    ['link'],
                    ['btnGrp-image'],
                    ['removeformat'],
                    ['fullscreen'],
                ],
                btnsDef: {
                    'btnGrp-image': {
                        dropdown: ['insertImage', 'base64'],
                        ico: 'insertImage'
                    }   
                },
                
            },
        }
    },

    computed:{
        ...mapState(["isUpdate","oldBranch","branchType"]),
    },
    
    methods:{
        ...mapActions({
          updateBranch1: 'branches1/updateBranch1',
          getBranches1: 'branches1/getBranches1',
          addBranch1: 'branches1/addBranch1',
          updateBranch2: 'branches2/updateBranch2',
          getBranches2: 'branches2/getBranches2',
          addBranch2: 'branches2/addBranch2',
          updateBranch3: 'branches3/updateBranch3',
          getBranches3: 'branches3/getBranches3',
          addBranch3: 'branches3/addBranch3',
          updateBranch4: 'branches4/updateBranch4',
          getBranches4: 'branches4/getBranches4',
          addBranch4: 'branches4/addBranch4',
          updateBranch5: 'branches5/updateBranch5',
          getBranches5: 'branches5/getBranches5',
          addBranch5: 'branches5/addBranch5',
        }),
        
        handleSubmit(){
            const branchName = document.getElementById('branch-name');
            
            if(branchName && branchName.innerText && branchName.innerText.length > 2){
                if(this.isUpdate){
                    // Update existing branch
                    const updatedBranch = {
                        ...this.oldBranch,
                        title: branchName.innerText,
                        content: this.form.content
                    };
                    
                    switch(this.branchType){
                        case 'branch1':
                            this.updateBranch1(updatedBranch);
                            this.form.content = `<h1 class="branch-name" id="branch-name"></h1>`;
                            setTimeout(() => this.getBranches1(), 200);
                            break;
                        case 'branch2':
                            this.updateBranch2(updatedBranch);
                            this.form.content = `<h1 class="branch-name" id="branch-name"></h1>`;
                            setTimeout(() => this.getBranches2(), 200);
                            break;
                        case 'branch3':
                            this.updateBranch3(updatedBranch);
                            this.form.content = `<h1 class="branch-name" id="branch-name"></h1>`;
                            setTimeout(() => this.getBranches3(), 200);
                            break;
                        case 'branch4':
                            this.updateBranch4(updatedBranch);
                            this.form.content = `<h1 class="branch-name" id="branch-name"></h1>`;
                            setTimeout(() => this.getBranches4(), 200);
                            break;
                        case 'branch5':
                            this.updateBranch5(updatedBranch);
                            this.form.content = `<h1 class="branch-name" id="branch-name"></h1>`;
                            setTimeout(() => this.getBranches5(), 200);
                            break;
                    }
                } else {
                    // Add new branch
                    const newBranch = {
                        title: branchName.innerText,
                        content: this.form.content,
                        branch_id: this.$store.state.selectedParentId || null, // Set parent branch ID
                        isShow: false,
                        isAdd: false,
                    };
                    
                    switch(this.branchType){
                        case 'branch1':
                            this.addBranch1(newBranch);
                            this.form.content = `<h1 class="branch-name" id="branch-name"></h1>`;
                            setTimeout(() => this.getBranches1(), 200);
                            break;
                        case 'branch2':
                            this.addBranch2(newBranch);
                            this.form.content = `<h1 class="branch-name" id="branch-name"></h1>`;
                            setTimeout(() => this.getBranches2(), 200);
                            break;
                        case 'branch3':
                            this.addBranch3(newBranch);
                            this.form.content = `<h1 class="branch-name" id="branch-name"></h1>`;
                            setTimeout(() => this.getBranches3(), 200);
                            break;
                        case 'branch4':
                            this.addBranch4(newBranch);
                            this.form.content = `<h1 class="branch-name" id="branch-name"></h1>`;
                            setTimeout(() => this.getBranches4(), 200);
                            break;
                        case 'branch5':
                            this.addBranch5(newBranch);
                            this.form.content = `<h1 class="branch-name" id="branch-name"></h1>`;
                            setTimeout(() => this.getBranches5(), 200);
                            break;
                    }
                }
            } else {
                alert('Please enter a branch name with more than two letters!');
            }
        },
    }
}

</script>
