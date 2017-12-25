package com.e3mall.search.service.impl;

import java.util.List;

import org.apache.solr.client.solrj.SolrServer;
import org.apache.solr.common.SolrInputDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.e3mall.common.pojo.SearchItem;
import com.e3mall.common.utils.E3Result;
import com.e3mall.search.mapper.ItemMapper;
import com.e3mall.search.service.SearchItemService;

/**
 * 索引库维护Service
 * 
 * @author ZXL
 *
 */
@Service
public class SearchItemServiceImpl implements SearchItemService {

	@Autowired
	private ItemMapper itemMapper;
	@Autowired
	private SolrServer solrServer;

	@Override
	public E3Result importAllItems() {
		try {
			// 查询商品列表
			List<SearchItem> itemList = itemMapper.getItemList();
			// 遍历商品列表
			for (SearchItem searchItem : itemList) {
				// 创建文档对象
				SolrInputDocument document = new SolrInputDocument();
				// 向文档对象中添加域
				document.addField("id", searchItem.getId());
				document.addField("item_title", searchItem.getTitle());
				document.addField("item_sell_point", searchItem.getSell_point());
				document.addField("item_price", searchItem.getPrice());
				document.addField("item_image", searchItem.getImage());
				document.addField("item_category_name", searchItem.getCategory_name());
				// 把文档对象写入索引库
				solrServer.add(document);
			}
			// 提交
			solrServer.commit();
			// 返回导入成功
			return E3Result.ok();
		} catch (Exception e) {
			e.printStackTrace();
			return E3Result.build(500, "数据导入时发生异常");

		}
	}

}
