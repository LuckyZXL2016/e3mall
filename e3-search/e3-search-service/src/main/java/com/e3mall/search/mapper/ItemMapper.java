package com.e3mall.search.mapper;

import java.util.List;

import com.e3mall.common.pojo.SearchItem;

public interface ItemMapper {

	List<SearchItem> getItemList();
	SearchItem getItemById(long itemId);
}
