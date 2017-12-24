package com.e3mall.service;

import java.util.List;

import com.e3mall.common.pojo.EasyUITreeNode;

public interface ItemCatService {
	
	List<EasyUITreeNode> getItemCatlist(long parentId);
}
