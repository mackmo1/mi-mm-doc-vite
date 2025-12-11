<template>
  <div class="left" @click="handleHide">
    <h3 class="mainlist-title" @click.stop="handleAdd">
      Add New Main Branch
      <i
        class="fa fa-plus-circle"
        aria-hidden="true"
        title="Add New Branch"
      ></i>
    </h3>
    <!-- Showing the first list -->
    <ul class="items" v-if="branches1">
      <li v-for="branch1 in branches1" :key="branch1.id" class="item">
        <i
          class="descIcon fa fa-sort-desc"
          aria-hidden="true"
          v-if="branch1.isShow"
          @click.stop="showList1(branch1.id)"
        ></i>
        <i
          class="descIcon fa fa-caret-right"
          aria-hidden="true"
          v-else
          @click.stop="showList1(branch1.id)"
        ></i>
        <h3
          class="title"
          @contextmenu.prevent="showMenu1(branch1.id)"
          @click.stop="getBranch1(branch1.id)"
        >
          {{ branch1.title }}
        </h3>
        <ActionsMenu
          v-if="branch1.isAdd && b1"
          addData="branch2"
          deleteData="branch1"
          :branch="branch1"
          :branchId="branch1.id"
        />
        <!-- Showing the second list -->
        <ul class="items" v-if="branch1.isShow">
          <li v-for="branch2 in branches2" :key="branch2.id" class="item">
            <div v-if="branch2.branch_id === branch1.id">
              <i
                class="descIcon fa fa-sort-desc"
                aria-hidden="true"
                v-if="branch2.isShow"
                @click.stop="showList2(branch2.id)"
              ></i>
              <i
                class="descIcon fa fa-caret-right"
                aria-hidden="true"
                v-else
                @click.stop="showList2(branch2.id)"
              ></i>
              <h3
                class="title"
                @contextmenu.prevent="showMenu2(branch2.id)"
                @click.stop="getBranch2(branch2.id)"
              >
                {{ branch2.title }}
              </h3>
              <ActionsMenu
                v-if="branch2.isAdd && b2"
                addData="branch3"
                deleteData="branch2"
                :branch="branch2"
                :branchId="branch2.id"
              />
            </div>
            <!-- Show the third list -->
            <ul class="items" v-if="branch2.isShow">
              <li v-for="branch3 in branches3" :key="branch3.id" class="item">
                <div
                  v-if="
                    branch3.branch_id === branch2.id &&
                    branch2.branch_id == branch1.id
                  "
                >
                  <i
                    class="descIcon fa fa-sort-desc"
                    aria-hidden="true"
                    v-if="branch3.isShow"
                    @click.stop="showList3(branch3.id)"
                  ></i>
                  <i
                    class="descIcon fa fa-caret-right"
                    aria-hidden="true"
                    v-else
                    @click.stop="showList3(branch3.id)"
                  ></i>
                  <h3
                    class="title"
                    @contextmenu.prevent="showMenu3(branch3.id)"
                    @click.stop="getBranch3(branch3.id)"
                  >
                    {{ branch3.title }}
                  </h3>
                  <ActionsMenu
                    v-if="branch3.isAdd && b3"
                    addData="branch4"
                    deleteData="branch3"
                    :branch="branch3"
                    :branchId="branch3.id"
                  />
                </div>
                <!-- Show the fourth list -->
                <ul class="items" v-if="branch3.isShow">
                  <li
                    v-for="branch4 in branches4"
                    :key="branch4.id"
                    class="item"
                  >
                    <div
                      v-if="
                        branch4.branch_id === branch3.id &&
                        branch3.branch_id === branch2.id &&
                        branch2.branch_id == branch1.id
                      "
                    >
                      <i
                        class="descIcon fa fa-sort-desc"
                        aria-hidden="true"
                        v-if="branch4.isShow"
                        @click.stop="showList4(branch4.id)"
                      ></i>
                      <i
                        class="descIcon fa fa-caret-right"
                        aria-hidden="true"
                        v-else
                        @click.stop="showList4(branch4.id)"
                      ></i>
                      <h3
                        class="title"
                        @contextmenu.prevent="showMenu4(branch4.id)"
                        @click.stop="getBranch4(branch4.id)"
                      >
                        {{ branch4.title }}
                      </h3>
                      <ActionsMenu
                        v-if="branch4.isAdd && b4"
                        addData="branch5"
                        deleteData="branch4"
                        :branch="branch4"
                        :branchId="branch4.id"
                      />
                    </div>
                    <!-- Show the fifth list -->
                    <ul class="items" v-if="branch4.isShow">
                      <li
                        v-for="branch5 in branches5"
                        :key="branch5.id"
                        class="item"
                      >
                        <div
                          v-if="
                            branch5.branch_id === branch4.id &&
                            branch4.branch_id === branch3.id &&
                            branch3.branch_id === branch2.id &&
                            branch2.branch_id == branch1.id
                          "
                        >
                          <h3
                            class="title"
                            @contextmenu.prevent="showMenu5(branch5.id)"
                            @click.stop="getBranch5(branch5.id)"
                          >
                            &nbsp; {{ branch5.title }}
                          </h3>
                          <ActionsMenu
                            v-if="branch5.isAdd && b5"
                            deleteData="branch5"
                            :branch="branch5"
                            :branchId="branch5.id"
                          />
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
    <button class="close" title="Close The Editor" @click.stop="handleClose">
      Close The Editor
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import ActionsMenu from "./ActionsMenu.vue";

export default {
  name: "LeftSide",
  components: { ActionsMenu },
  computed: {
    ...mapGetters({
      branches1: 'branches1/branches1',
      branches2: 'branches2/branches2',
      branches3: 'branches3/branches3',
      branches4: 'branches4/branches4',
      branches5: 'branches5/branches5',
    }),
    ...mapState(["b1", "b2", "b3", "b4", "b5"]),
  },
  mounted() {
    this.getBranches1();
    this.getBranches2();
    this.getBranches3();
    this.getBranches4();
    this.getBranches5();
    
    // Add global click listener to hide context menu
    document.addEventListener('click', this.handleGlobalClick);
  },
  beforeUnmount() {
    // Clean up global click listener
    document.removeEventListener('click', this.handleGlobalClick);
  },
  beforeUpdate() {
    $(document).ready(function () {
      $(".item").click(function () {
        // remove classes from all
        $(".item").removeClass("active");
        // add class to the one we clicked
        $(this).addClass("active");
        // stop the page from jumping to the top
        return false;
      });
    });
  },
  methods: {
    ...mapActions({
      getBranches1: 'branches1/getBranches1',
      getBranch1: 'branches1/getBranch1',
      getBranches2: 'branches2/getBranches2',
      getBranch2: 'branches2/getBranch2',
      getBranches3: 'branches3/getBranches3',
      getBranch3: 'branches3/getBranch3',
      getBranches4: 'branches4/getBranches4',
      getBranch4: 'branches4/getBranch4',
      getBranches5: 'branches5/getBranches5',
      getBranch5: 'branches5/getBranch5',
    }),

    ...mapMutations([
      "showList1",
      "showList2",
      "showList3",
      "showList4",
      "showList5",
      "showMenu1",
      "showMenu2",
      "showMenu3",
      "showMenu4",
      "showMenu5",
    ]),

    handleClose() {
      this.$store.commit("closeEditor");
    },
    handleAdd() {
      this.$store.commit("resetToAdd");
    },
    handleHide() {
      this.$store.commit("hideShowMenu");
    },
    handleGlobalClick() {
      // Hide context menu when clicking anywhere
      this.$store.commit("hideShowMenu");
    }
  },
};
</script>
