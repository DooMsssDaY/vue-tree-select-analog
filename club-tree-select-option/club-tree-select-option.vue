<template>
	<div v-if="canShow" class="club-tree-select-option">
		<div class="club-tree-select-option__title" @mousedown="onTitleClick" :class="titleCssClasses">
			<div v-if="hasChilds" class="club-tree-select-option__title-arrow" :class="{'opened': isChildsOpened}">
				<icon size="24">$arrow-right</icon>
			</div>

			<div class="club-tree-select-option__title-text">{{ option.label }}</div>
		</div>
		<div
			v-if="hasChilds"
			v-show="isChildsOpened"
			class="club-tree-select-option__childs-group"
			:style="childsGroupCssStyle"
		>
			<club-tree-select-option
				v-for="child in option.children"
				:key="'opt_' + child.id"
				:option="child"
				:level="nextLevel"
				:selected-id="selectedId"
				:search-text="searchText"
				:parent-is-matched="isMatched"
				@select="onSelect"
			/>
		</div>
	</div>
</template>

<script lang="ts" src="./club-tree-select-option.ts"></script>

<style lang="scss">
	@import '~/assets/styles/utilities';

	.club-tree-select-option {
		&__title {
			@include unselectable();
			display: flex;
			cursor:  pointer;
			padding: 9px 0;

			&:hover {
				&.selectable {
					background-color: #faf9f9;
				}
			}

			&.selected {
				background-color: #eee;
				font-weight:      bold;
			}

			&-arrow {
				.icon {
					transform:  rotate(-90deg);
					transition: all 0.2s ease;
				}

				&.opened {
					.icon {
						transform: rotate(0deg);
					}
				}
			}

			&-text {
				padding-left: 10px;
			}
		}
	}

</style>
