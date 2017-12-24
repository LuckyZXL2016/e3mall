package com.e3mall.content.service;

import java.util.List;

import com.e3mall.common.pojo.EasyUITreeNode;
import com.e3mall.common.utils.E3Result;

public interface ContentCategoryService {
	
	List<EasyUITreeNode> getContentCatList(long parentId);
	E3Result addContentCategory(long parentId, String name);
}
