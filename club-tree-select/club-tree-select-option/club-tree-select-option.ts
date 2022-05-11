import {Vue, Prop, Component, Watch} from '~/node_modules/vue-property-decorator';
import {VueTreeSelectItem} from '~/models/common/VueTreeSelectItem';

/**
 * Компонент элемента для выбора в выпадающем списке Клубного аналога vue-treeselect.
 *
 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
 */
@Component({
	name: 'club-tree-select-option', // name нужен, т.к. компонент рекурсивный
})
export default class ClubTreeSelectOption extends Vue {
	/** Элемент для выбора. */
	@Prop({required: true})
	public option!: VueTreeSelectItem;

	/** Идентификатор выбранного элемента. */
	@Prop({default: null})
	public selectedId!: number|null;

	/** Введенный поисковый текст. */
	@Prop({default: ''})
	public searchText!: string;

	/** Уровень вложенности. */
	@Prop({default: 1})
	public level!: number;

	/** Подходит ли родительский элемент под поисковую строку. */
	@Prop({default: false})
	public parentIsMatched!: boolean;

	/** Раскрыт ли блок с дочерними элементами. */
	protected isChildsOpened: boolean = false;

	/**
	 * Получение следующего уровня вложенности элементов для выбора.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected get nextLevel(): number {
		return (this.level + 1);
	}

	/**
	 * Получение калькулируемых стилей группы дочерних элементов для выбора.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected get childsGroupCssStyle(): object {
		const indent: number = 30;
		const offset: string = (indent * this.level) + 'px';

		return {
			'margin-left': offset,
		};
	}

	/**
	 * Вычисляемые стили заголовка элемента.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected get titleCssClasses(): object {
		return {
			selectable: false === this.hasChilds,
			selected:   (this.selectedId === this.option.id),
		};
	}

	/**
	 * Имеет ли вариант вложенные элементы для выбора.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected get hasChilds(): boolean {
		return (undefined !== this.option.children);
	}

	/**
	 * Обработчик клика по элементу.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected onTitleClick(e: MouseEvent): void {
		e.preventDefault();

		if (this.hasChilds) {
			this.isChildsOpened = !this.isChildsOpened;
		}
		else {
			this.onSelect(this.option);
		}
	}

	/**
	 * Наблюдение за состоянием поискового текста.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	@Watch('searchText')
	protected onSearchTextChange(): void {
		// При поиске, все вложенные потомки должны быть раскрыты.
		this.isChildsOpened = ('' !== this.searchText);
	}

	/**
	 * Нужно ли отображать вариант для выбора.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected get canShow(): boolean {
		if ('' === this.searchText) {
			return true;
		}

		// Если родитель подходит под поисковую строку, то все потомки должны выводиться без фильтрации
		if (this.parentIsMatched) {
			return true;
		}

		return (this.isMatched || this.isOneOfChildsIsMatched);
	}

	/**
	 * Подходит ли данный вариант для выбора под поисковую строку.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected get isMatched(): boolean {
		return (-1 !== this.option.label.toLowerCase().indexOf(this.searchText));
	}

	/**
	 * Подходит ли данный вариант для выбора под поисковую строку.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected get isOneOfChildsIsMatched(): boolean {
		const item = this.option.children?.find((item: VueTreeSelectItem) => {
			return (-1 !== item.label.toLowerCase().indexOf(this.searchText));
		});

		return (undefined !== item);
	}

	/**
	 * Обработчик события выбора элемента.
	 *
	 * @author Турушев Николай <Turushev.NS@dns-shop.ru>
	 */
	protected onSelect(item: VueTreeSelectItem): void {
		this.$emit('select', item);
	}
}
